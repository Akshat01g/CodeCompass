import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('codecompass.reviewCode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('Please open a file to review.');
            return;
        }

        const text = editor.document.getText();
        if (!text.trim()) {
            vscode.window.showInformationMessage('The file is empty.');
            return;
        }

        vscode.window.showInformationMessage('CodeCompass: Analyzing your code...');

        try {
            const apiKey = process.env.GEMINI_API_KEY || "Your_API_Key";
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const prompt = `
            You are an Expert Programming Mentor. Review the following code. 
            RULES:
            1. DO NOT provide the corrected code.
            2. Analyze for bugs, syntax errors, or logic flaws.
            3. IF ERROR: Provide a general hint.
            4. IF NO ERROR: Start with "No error found!" and suggest optimizations.
            5. Always state Time Complexity and Space Complexity.
            
            Format strictly as:
            <p><strong style="color: #4CAF50;">Time Complexity:</strong> [Complexity]</p>
            <p><strong style="color: #2196F3;">Space Complexity:</strong> [Complexity]</p>
            <hr style="border: 1px solid #444; margin: 15px 0;">
            <p><strong style="color: #ce9178;">Mentor's Note:</strong> [Hint or Tips]</p>

            Code:
            \`\`\`
            ${text}
            \`\`\`
            `;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            const panel = vscode.window.createWebviewPanel('codeCompassUI', 'CodeCompass', vscode.ViewColumn.Beside, { enableScripts: true });

            const templatePath = path.join(context.extensionPath, 'src', 'template.html');
            const cssPath = path.join(context.extensionPath, 'src', 'style.css');

            let htmlContent = fs.readFileSync(templatePath, 'utf8');
            const cssUri = panel.webview.asWebviewUri(vscode.Uri.file(cssPath));

            htmlContent = htmlContent.replace('{{CSS_URI}}', cssUri.toString()).replace('{{CONTENT}}', responseText);
            panel.webview.html = htmlContent;

        } catch (error: any) {
            vscode.window.showErrorMessage('Error: ' + error.message);
        }
    });
    context.subscriptions.push(disposable);
}
export function deactivate() {}