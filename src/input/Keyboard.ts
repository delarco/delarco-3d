export enum KEYS {
    ARROW_UP = 'ArrowUp',
    ARROW_DOWN = 'ArrowDown',
    ARROW_LEFT = 'ArrowLeft',
    ARROW_RIGHT = 'ArrowRight',
}

export class Keyboard {

    private keyState: { [key: string]: boolean } = {};

    constructor() {

        this.bindEvents();
    }

    private bindEvents(): void {

        document.addEventListener("keydown", ev => this.onDocumentKeyDown(ev));
        document.addEventListener("keyup", ev => this.onDocumentKeyUp(ev));
    }

    private onDocumentKeyDown(ev: KeyboardEvent): void {

        this.keyState[ev.key] = true;        
    }

    private onDocumentKeyUp(ev: KeyboardEvent): void {

        this.keyState[ev.key] = false;
    }

    public key(key: KEYS) {

        return this.keyState[key];
    }
}
