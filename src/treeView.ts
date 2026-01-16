import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class NoteItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly resourceUri?: vscode.Uri,
        public readonly isDirectory?: boolean,
        public readonly actionCommand?: string
    ) {
        super(label, collapsibleState);

        if (isDirectory) {
            this.iconPath = new vscode.ThemeIcon('folder');
            this.contextValue = 'folder';
        } else if (resourceUri && label.toLowerCase().endsWith('.pdf')) {
            this.iconPath = new vscode.ThemeIcon('file-pdf');
            this.contextValue = 'pdf';
            this.command = {
                command: 'goodnotes.openPdf',
                title: 'Open PDF',
                arguments: [this]
            };
        } else if (actionCommand) {
            this.iconPath = new vscode.ThemeIcon('folder-opened');
            this.contextValue = 'action';
            this.command = {
                command: actionCommand,
                title: label
            };
        } else {
            this.iconPath = new vscode.ThemeIcon('file');
            this.contextValue = 'file';
        }
    }
}

export class GoodNotesTreeProvider implements vscode.TreeDataProvider<NoteItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<NoteItem | undefined | null | void> = new vscode.EventEmitter<NoteItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<NoteItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(private context: vscode.ExtensionContext) {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: NoteItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: NoteItem): Promise<NoteItem[]> {
        const folderPath = this.context.globalState.get<string>('goodnotes.folderPath');

        // フォルダ未設定の場合
        if (!folderPath) {
            return [
                new NoteItem(
                    'フォルダを設定',
                    vscode.TreeItemCollapsibleState.None,
                    undefined,
                    false,
                    'goodnotes.setFolder'
                )
            ];
        }

        // フォルダが存在しない場合
        if (!fs.existsSync(folderPath)) {
            return [
                new NoteItem(
                    'フォルダが見つかりません',
                    vscode.TreeItemCollapsibleState.None,
                    undefined,
                    false,
                    'goodnotes.setFolder'
                )
            ];
        }

        // 対象フォルダを決定
        const targetPath = element?.resourceUri?.fsPath || folderPath;

        try {
            const entries = fs.readdirSync(targetPath, { withFileTypes: true });
            const items: NoteItem[] = [];

            // フォルダを先に、その後ファイル（PDF優先）
            const folders = entries.filter(e => e.isDirectory() && !e.name.startsWith('.'));
            const files = entries.filter(e => e.isFile() && !e.name.startsWith('.'));

            // PDFファイルのみ表示（オプションで全ファイルも可）
            const pdfFiles = files.filter(f => f.name.toLowerCase().endsWith('.pdf'));

            // フォルダを追加
            for (const folder of folders.sort((a, b) => a.name.localeCompare(b.name))) {
                const fullPath = path.join(targetPath, folder.name);
                items.push(new NoteItem(
                    folder.name,
                    vscode.TreeItemCollapsibleState.Collapsed,
                    vscode.Uri.file(fullPath),
                    true
                ));
            }

            // PDFファイルを追加
            for (const file of pdfFiles.sort((a, b) => a.name.localeCompare(b.name))) {
                const fullPath = path.join(targetPath, file.name);
                items.push(new NoteItem(
                    file.name,
                    vscode.TreeItemCollapsibleState.None,
                    vscode.Uri.file(fullPath),
                    false
                ));
            }

            return items;
        } catch (error) {
            console.error('Failed to read directory:', error);
            return [];
        }
    }
}
