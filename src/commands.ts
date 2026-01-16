import * as vscode from 'vscode';
import { NoteItem } from './treeView';

/**
 * フォルダ設定コマンド
 */
export function createSetFolderCommand(
    context: vscode.ExtensionContext,
    onFolderSet: (folderPath: string) => void
): vscode.Disposable {
    return vscode.commands.registerCommand('goodnotes.setFolder', async () => {
        const result = await vscode.window.showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            title: 'GoodNotesバックアップフォルダを選択'
        });

        if (result && result[0]) {
            const folderPath = result[0].fsPath;
            await context.globalState.update('goodnotes.folderPath', folderPath);
            vscode.window.showInformationMessage(`フォルダを設定しました: ${folderPath}`);
            onFolderSet(folderPath);
        }
    });
}

/**
 * リフレッシュコマンド
 */
export function createRefreshCommand(onRefresh: () => void): vscode.Disposable {
    return vscode.commands.registerCommand('goodnotes.refresh', onRefresh);
}

/**
 * PDF開くコマンド
 */
export function createOpenPdfCommand(): vscode.Disposable {
    return vscode.commands.registerCommand('goodnotes.openPdf', async (item: NoteItem) => {
        if (item.resourceUri) {
            await vscode.commands.executeCommand('vscode.open', item.resourceUri);
        }
    });
}

/**
 * 設定クリアコマンド
 */
export function createClearSettingsCommand(
    context: vscode.ExtensionContext,
    onClear: () => void
): vscode.Disposable {
    return vscode.commands.registerCommand('goodnotes.clearSettings', async () => {
        await context.globalState.update('goodnotes.folderPath', undefined);
        vscode.window.showInformationMessage('設定をクリアしました');
        onClear();
    });
}

/**
 * ファイルをコピーコマンド（macOS / Windows対応）
 */
export function createCopyFileCommand(): vscode.Disposable {
    return vscode.commands.registerCommand('goodnotes.copyFile', async (item: NoteItem) => {
        if (!item.resourceUri) {
            return;
        }

        const filePath = item.resourceUri.fsPath;
        const { exec } = require('child_process');

        if (process.platform === 'darwin') {
            exec(`osascript -e 'set the clipboard to (POSIX file "${filePath}")'`, (error: Error | null) => {
                if (error) {
                    vscode.window.showErrorMessage(`コピーに失敗しました: ${error.message}`);
                } else {
                    vscode.window.showInformationMessage('ファイルをコピーしました');
                }
            });
        } else if (process.platform === 'win32') {
            const escaped = filePath.replace(/'/g, "''");
            exec(`powershell -command "Set-Clipboard -Path '${escaped}'"`, (error: Error | null) => {
                if (error) {
                    vscode.window.showErrorMessage(`コピーに失敗しました: ${error.message}`);
                } else {
                    vscode.window.showInformationMessage('ファイルをコピーしました');
                }
            });
        } else {
            vscode.window.showWarningMessage('このOSではファイルコピーはサポートされていません');
        }
    });
}

/**
 * パスをコピーコマンド
 */
export function createCopyPathCommand(): vscode.Disposable {
    return vscode.commands.registerCommand('goodnotes.copyPath', async (item: NoteItem) => {
        if (item.resourceUri) {
            await vscode.env.clipboard.writeText(item.resourceUri.fsPath);
            vscode.window.showInformationMessage('パスをコピーしました');
        }
    });
}

/**
 * 名前を付けて保存コマンド
 */
export function createSaveAsCommand(): vscode.Disposable {
    return vscode.commands.registerCommand('goodnotes.saveAs', async (item: NoteItem) => {
        if (!item.resourceUri) {
            return;
        }

        const defaultName = item.resourceUri.fsPath.split('/').pop() || 'document.pdf';
        const saveUri = await vscode.window.showSaveDialog({
            defaultUri: vscode.Uri.file(defaultName),
            filters: { 'PDF': ['pdf'] }
        });

        if (saveUri) {
            try {
                const fs = require('fs');
                fs.copyFileSync(item.resourceUri.fsPath, saveUri.fsPath);
                vscode.window.showInformationMessage(`保存しました: ${saveUri.fsPath}`);
            } catch (error) {
                vscode.window.showErrorMessage(`保存に失敗しました: ${error}`);
            }
        }
    });
}
