import { Matrix4x4 } from "../core/Matrix4x4";
import { Mesh } from "../core/Mesh";
import { Scene } from "../scene/Scene";
import { MatrixUtils } from "../utils/Matrix.utils";
import { GameConfig } from "./GameConfig";

export class Game {

    private config: GameConfig;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D | null;

    public get domElement() { return this.canvas; }

    public scene: Scene;

    private projectionMatrix: Matrix4x4;

    private _firstFrame = true;

    constructor(config: GameConfig = new GameConfig()) {

        this.config = config;

        this.canvas = document.createElement("canvas");
        this.canvas.width = config.resolution.width;
        this.canvas.height = config.resolution.height;
        this.canvas.style.width = config.viewPort.width + 'px';
        this.canvas.style.height = config.viewPort.height + 'px';

        this.context = this.canvas.getContext("2d");

        if (!this.context) {
            throw new Error("Can't get context");
        }

        this.context.fillStyle = '#000';
        this.context.fillRect(0, 0, config.resolution.width, config.resolution.height);

        this.projectionMatrix = MatrixUtils.createProjectionMatrix(config.camera);
    }

    public run(): void {

        this.scene.preload();
        this.scene.initialize();

        requestAnimationFrame(() => this.update());
    }

    private update(): void {

        this.scene.update(0, 0);

        for (let mesh of this.scene.meshes) {

            this.drawMesh(mesh);
        }

        this._firstFrame = false;

        requestAnimationFrame(() => this.update());
    }

    private drawMesh(mesh: Mesh): void {

        for (let triangle of mesh.triangles) {

            // Convert 3D to 2D
            const projectedTriangle = MatrixUtils.multiplyTriangle(triangle, this.projectionMatrix);

            // Scale to screen size
            for (let point of projectedTriangle.points) {

                point.x += 1.0;
                point.y += 1.0;
                point.x *= 0.5 * this.config.resolution.width;
                point.y *= 0.5 * this.config.resolution.height;
            }

            // Draw triangle
            this.context!.strokeStyle = '#F00';
            this.context!.beginPath();
            this.context!.moveTo(projectedTriangle.p1.x, projectedTriangle.p1.y);
            this.context!.lineTo(projectedTriangle.p2.x, projectedTriangle.p2.y);
            this.context!.lineTo(projectedTriangle.p3.x, projectedTriangle.p3.y);
            this.context!.lineTo(projectedTriangle.p1.x, projectedTriangle.p1.y);
            this.context!.stroke();
            this.context!.closePath();

            if(this._firstFrame) console.log(projectedTriangle);
        }
    }
}
