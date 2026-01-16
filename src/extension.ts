import * as vscode from 'vscode';
import { GoodNotesTreeProvider } from './treeView';
import { FileWatcher } from './fileWatcher';
import {
    createSetFolderCommand,
    createRefreshCommand,
    createOpenPdfCommand,
    createClearSettingsCommand,
    createCopyFileCommand,
    createCopyPathCommand,
    createSaveAsCommand
} from './commands';

let treeProvider: GoodNotesTreeProvider;
let fileWatcher: FileWatcher | undefined;

export function activate(context: vscode.ExtensionContext) {
    console.log('GoodNotes Viewer is now active');

    // TreeView初期化
    treeProvider = new GoodNotesTreeProvider(context);
    const treeView = vscode.window.createTreeView('goodnotesExplorer', {
        treeDataProvider: treeProvider,
        showCollapseAll: true
    });
    context.subscriptions.push(treeView);

    // コマンド登録
    context.subscriptions.push(
        createSetFolderCommand(context, (folderPath) => {
            treeProvider.refresh();
            setupFileWatcher(context, folderPath);
        }),
        createRefreshCommand(() => treeProvider.refresh()),
        createOpenPdfCommand(),
        createClearSettingsCommand(context, () => {
            disposeFileWatcher();
            treeProvider.refresh();
        }),
        createCopyFileCommand(),
        createCopyPathCommand(),
        createSaveAsCommand()
    );

    // 起動時にフォルダパスがあればファイル監視を開始
    const savedPath = context.globalState.get<string>('goodnotes.folderPath');
    if (savedPath) {
        setupFileWatcher(context, savedPath);
    }
}

function setupFileWatcher(context: vscode.ExtensionContext, folderPath: string) {
    disposeFileWatcher();
    fileWatcher = new FileWatcher(folderPath, () => treeProvider.refresh());
    context.subscriptions.push(fileWatcher);
}

function disposeFileWatcher() {
    if (fileWatcher) {
        fileWatcher.dispose();
        fileWatcher = undefined;
    }
}

export function deactivate() {
    disposeFileWatcher();
}
