export default class Loggy {

    constructor(public loggingEnabled: boolean = false) {
    }

    public log(...data: unknown[]): void {
        if (!this.loggingEnabled) return;
        console.log('📗', ...data);
    }

    public info(...data: unknown[]): void {
        if (!this.loggingEnabled) return;
        console.info('📘', ...data);
    }

    public warn(...data: unknown[]): void {
        if (!this.loggingEnabled) return;
        console.warn('📙', ...data);
    }

    public error(...data: unknown[]): void {
        console.error('📕', ...data, '\x1b[0m');
    }

}
