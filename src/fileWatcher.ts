import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class FileWatcher implements vscode.Disposable {
    private watcher: fs.FSWatcher | undefined;
    private debounceTimer: NodeJS.Timeout | undefined;
    private pendingFiles: Set<string> = new Set();

    constructor(
        private folderPath: string,
        private onChanged: () => void,
        private onFileUpdated?: (filePath: string) => void
    ) {
        this.startWatching();
    }

    private startWatching() {
        try {
            this.watcher = fs.watch(this.folderPath, { recursive: true }, (eventType, filename) => {
                // PDFファイルの変更のみ反応
                if (filename && filename.toLowerCase().endsWith('.pdf')) {
                    const fullPath = path.join(this.folderPath, filename);
                    this.pendingFiles.add(fullPath);
                    this.debounceRefresh();
                }
            });
        } catch (error) {
            console.error('Failed to start file watcher:', error);
        }
    }

    private debounceRefresh() {
        // 連続した変更をまとめる（500ms）
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        this.debounceTimer = setTimeout(() => {
            // ツリーを更新
            this.onChanged();

            // 更新されたファイルを通知
            if (this.onFileUpdated) {
                for (const filePath of this.pendingFiles) {
                    this.onFileUpdated(filePath);
                }
            }
            this.pendingFiles.clear();
        }, 500);
    }

    dispose() {
        if (this.watcher) {
            this.watcher.close();
        }
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
    }
}
