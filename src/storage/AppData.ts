export class AppData {
    static setCurrentPath(path: string): void {
        localStorage.setItem('currentPath', path);
    }

    static currentPath(): string|null {
        return localStorage.getItem('currentPath');
    }
}
