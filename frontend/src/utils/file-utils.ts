export class FileUtils {
    public static loadPageScript(src: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const script: HTMLScriptElement = document.createElement('script');
            script.src = src;
            script.onload = () => resolve('Script loaded: ' + src);
            script.onerror = () => reject(new Error('Script load error for: ' + src));
            document.body.appendChild(script);
        })
    }
}