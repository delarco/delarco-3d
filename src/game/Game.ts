import { Scene } from "../scene/Scene";
import { GameConfig } from "./GameConfig";

export class Game {

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D | null;

    public get domElement() { return this.canvas; }

    public scene: Scene;

    constructor(config: GameConfig = new GameConfig()) {

        this.canvas = document.createElement("canvas");
        this.canvas.width = config.resolution.width;
        this.canvas.width = config.resolution.height;
        this.canvas.style.width = config.viewPort.width + 'px';
        this.canvas.style.height = config.viewPort.height + 'px';

        this.context = this.canvas.getContext("2d");

        if (!this.context) {
            throw new Error("Can't get context");
        }

        this.context.fillStyle = '#000';
        this.context.fillRect(0, 0, config.resolution.width, config.resolution.height);
    }

    public run(): void {

        this.scene.preload();
        this.scene.initialize();

        requestAnimationFrame(() => this.update());
    }

    private update(): void {

        this.scene.update(0, 0);

        requestAnimationFrame(() => this.update());
    }
}
