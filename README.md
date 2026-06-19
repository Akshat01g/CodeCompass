# CodeCompass 🚀
An AI-Powered Tech Mentor for Competitive Programmers

Ever wished you had an expert mentor inside your editor to review your code, point out hidden bugs, and analyze your performance? That is exactly what CodeCompass does.

CodeCompass is a VS Code extension that analyzes your active code files in real-time. By leveraging Google's Gemini AI, it provides expert-level code reviews, Time/Space complexity analysis, and optimization tips directly inside your editor.

## ✨ What's Inside

- **AI Code Review (Gemini 2.5):** Evaluates your code for logic flaws, syntax errors, and code bugs without giving you the answer directly.

- **Complexity Analysis:** Automatically calculates and displays the Time and Space complexity of your algorithms.

- **Proactive Optimization:** If your code is correct, the codecompass suggests ways to make it cleaner, faster, or more efficient.

- **One-Click Review:** Access the mentor directly from your editor's toolbar with a single click.

- **"Strict Mentor" Mode:** The codecompass is configured to avoid spoon-feeding, forcing you to think critically and debug your own logic.

## 🛠️ Tech Stack

- **Frontend:** TypeScript, VS Code Extension API, HTML, CSS.

- **AI Engine:** Google Gemini 2.5 Flash.

- **Interface:** VS Code Webview API.

## 🚀 Getting Started

### Prerequisites
- VS Code installed on your machine.

- A valid Gemini API Key.

### Local Setup
1. Clone this repository to your machine.

2. Open the folder in VS Code.

3. Install the dependencies by running `npm install` in the terminal.

4. Press `F5` to launch the Extension Development Host.

## 💡 How to Use
1. Open any source code file in your editor.

2. Look for the CodeCompass sparkle icon (✨) in the top-right corner of your editor toolbar.

3. Click the icon, and a side panel will open automatically with the AI's analysis, complexity breakdown, and a mentor's note.

4. Alternatively, you can use the command `CodeCompass: Review My Code` from the Command Palette (`Ctrl + Shift + P`).