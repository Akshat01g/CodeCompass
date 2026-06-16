import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

let currentPanel: vscode.WebviewPanel | undefined;

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('codecompass.reviewCode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No file open to review!');
            return;
        }

        const text = editor.document.getText();
        
        if (currentPanel) {
            currentPanel.reveal(vscode.ViewColumn.Beside);
        } else {
            currentPanel = vscode.window.createWebviewPanel(
                'codeCompassUI', 
                'CodeCompass', 
                vscode.ViewColumn.Beside, 
                { enableScripts: true }
            );
            currentPanel.onDidDispose(() => currentPanel = undefined);
        }

        currentPanel.webview.html = `<html><body><h2>Analyzing your code...</h2></body></html>`;

        try {
            const apiKey = process.env.GEMINI_API_KEY || "Your_API_Key";
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const prompt = `
            You are an expert programming mentor. Review the following code.
            Return ONLY raw HTML. Do NOT use markdown.
            
            <p><strong>Time Complexity:</strong> [Calculate]</p>
            <p><strong>Space Complexity:</strong> [Calculate]</p>
            <hr style="border: 0; border-top: 1px solid #444;">
            <p><strong>Mentor's Note:</strong> [Feedback in simple English]</p>
            
            Code:
            ${text}
            `;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            const templatePath = path.join(context.extensionPath, 'src', 'template.html');
            const cssPath = path.join(context.extensionPath, 'src', 'style.css');
            
            let htmlContent = fs.readFileSync(templatePath, 'utf8');
            const cssUri = currentPanel.webview.asWebviewUri(vscode.Uri.file(cssPath));

            currentPanel.webview.html = htmlContent
                .replace('{{CSS_URI}}', cssUri.toString())
                .replace('{{CONTENT}}', responseText);

        } catch (error: any) {
            if (currentPanel) {
                currentPanel.webview.html = `<h3>Error: ${error.message}</h3>`;
            }
        }
    });
    context.subscriptions.push(disposable);
}

export function deactivate() {}