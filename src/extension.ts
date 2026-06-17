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
            const apiKey = process.env.GEMINI_API_KEY || "Your_API_KEY";
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const prompt = `
            You are an expert programming mentor. Review the code.
            Return ONLY clean HTML using these specific classes: 
            - Use <span class="complexity-tag"> for complexity values.

            HTML format:
            <p><strong>Time Complexity:</strong> <span class="complexity-tag">[Value]</span></p>
            <p><strong>Space Complexity:</strong> <span class="complexity-tag">[Value]</span></p>
            <hr>
            <p><strong>Mentor's Note:</strong> [Feedback]</p>

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