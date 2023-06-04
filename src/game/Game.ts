import { Camera } from "../core/Camera";
import { Color } from "../core/Color";
import { Matrix4x4 } from "../core/Matrix4x4";
import { Mesh } from "../core/Mesh";
import { Triangle } from "../core/Triangle";
import { Vec3D } from "../core/Vect3D";
import { Scene } from "../scene/Scene";
import { CanvasUtils } from "../utils/Canvas.utils";
import { Clock } from "../utils/Clock";
import { MatrixUtils } from "../utils/Matrix.utils";
import { TriangleUtils } from "../utils/Triangle.utils";
import { VectorUtils } from "../utils/Vector.utils";
import { GameConfig } from "./GameConfig";

export class Game {

    private config: GameConfig;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D | null;
    private clock = new Clock();
    private camera: Camera;

    public get domElement() { return this.canvas; }

    public scene: Scene;

    private projectionMatrix: Matrix4x4;

    private backgroundColor = new Color(204, 204, 204);

    private previousTime = 0;

    private trianglesToRaster = new Array<Triangle>();

    private _firstFrame = true;

    constructor(config: GameConfig = new GameConfig()) {

        this.config = config;
        this.camera = config.camera;

        this.canvas = document.createElement("canvas");
        this.canvas.width = config.resolution.width;
        this.canvas.height = config.resolution.height;
        this.canvas.style.width = config.viewPort.width + 'px';
        this.canvas.style.height = config.viewPort.height + 'px';

        this.context = this.canvas.getContext("2d");

        if (!this.context) {
            throw new Error("Can't get context");
        }

        CanvasUtils.clear(this.context!, this.backgroundColor);

        this.projectionMatrix = MatrixUtils.createProjectionMatrix(config.camera);
    }

    public async run(): Promise<void> {

        await this.scene.preload();
        this.scene.initialize();

        const mainLoop = (currentTime: number): void => {

            const currentTimeInSecs = currentTime * 0.001;
            const deltaTime = currentTimeInSecs - this.previousTime;
            this.previousTime = currentTimeInSecs;

            this.clock.tick();
            this.clock.setFpsToTitle();

            CanvasUtils.clear(this.context!, this.backgroundColor);
            this.trianglesToRaster = [];

            this.scene.update(currentTime, deltaTime);

            for (let mesh of this.scene.meshes) {

                this.drawMesh(mesh);
            }

            this.drawTriangles();

            this._firstFrame = false;

            requestAnimationFrame(mainLoop);
        };

        requestAnimationFrame(mainLoop);
    }

    private drawMesh(mesh: Mesh): void {

        for (let triangle of mesh.triangles) {

            const rotXMatrix = MatrixUtils.rotationXMatrix(mesh.roation.x);
            const rotZMatrix = MatrixUtils.rotationZMatrix(mesh.roation.z);

            const rotatedZTriangle = MatrixUtils.multiplyTriangle(triangle, rotZMatrix);
            const rotatedTriangle = MatrixUtils.multiplyTriangle(rotatedZTriangle, rotXMatrix);

            // Translate
            for (let point of rotatedTriangle.points) {

                point.x += mesh.translation.x;
                point.y += mesh.translation.y;
                point.z += mesh.translation.z;
            }

            // Calculate normal
            const normal = TriangleUtils.calcNormal(rotatedTriangle);

            const dotProduct = VectorUtils.dotProduct(normal, new Vec3D(
                rotatedTriangle.p1.x - this.camera.position.x,
                rotatedTriangle.p1.y - this.camera.position.y,
                rotatedTriangle.p1.z - this.camera.position.z,
            ));

            if (dotProduct < 0) {

                // ambient light
                const length = VectorUtils.vectorLength(this.scene.ambientLight);

                const lightDirection = new Vec3D(
                    this.scene.ambientLight.x / length,
                    this.scene.ambientLight.y / length,
                    this.scene.ambientLight.z / length,
                );

                const shade = VectorUtils.dotProduct(normal, lightDirection);
                rotatedTriangle.color.shade(shade);

                // Convert 3D to 2D
                const projectedTriangle = MatrixUtils.multiplyTriangle(rotatedTriangle, this.projectionMatrix);

                // Scale to screen size
                for (let point of projectedTriangle.points) {

                    point.x += 1.0;
                    point.y += 1.0;
                    point.x *= 0.5 * this.config.resolution.width;
                    point.y *= 0.5 * this.config.resolution.height;
                }

                this.trianglesToRaster.push(projectedTriangle);
            }
        }
    }

    private triangleSortFunction(t1: Triangle, t2: Triangle): number {

        const z1 = (t1.p1.z + t1.p2.z + t1.p3.z) / 3.0;
        const z2 = (t2.p1.z + t2.p2.z + t2.p3.z) / 3.0;
        return z2 < z1 ? -1 : z2 > z1 ? 1 : 0;
    }

    private drawTriangles(): void {

        for(let triangle of this.trianglesToRaster.sort(this.triangleSortFunction)) {

            CanvasUtils.drawTriangle(this.context!, triangle);
        }
    }
}
