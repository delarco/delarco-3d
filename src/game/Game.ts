import { Camera } from "../core/Camera";
import { Color } from "../core/Color";
import { Matrix4x4 } from "../core/Matrix4x4";
import { Mesh } from "../core/Mesh";
import { Triangle } from "../core/Triangle";
import { Vec3D } from "../core/Vect3D";
import { Keyboard, KEYS } from "../input/Keyboard";
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

    private keyboard: Keyboard;

    private lookDir = new Vec3D(0, 0, 0);
    private yaw = 0;

    constructor(config: GameConfig = new GameConfig()) {

        this.config = config;
        this.camera = config.camera;

        this.canvas = document.createElement("canvas");
        this.canvas.width = config.resolution.width;
        this.canvas.height = config.resolution.height;
        this.canvas.style.width = config.viewPort.width + 'px';
        this.canvas.style.height = config.viewPort.height + 'px';
        this.canvas.style.imageRendering = 'crisp-edges'; // 'pixelated';

        this.context = this.canvas.getContext("2d");

        if (!this.context) {
            throw new Error("Can't get context");
        }

        this.context.imageSmoothingEnabled = false;

        CanvasUtils.clear(this.context!, this.backgroundColor);

        this.projectionMatrix = MatrixUtils.createProjectionMatrix(config.camera);

        this.keyboard = new Keyboard();
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

            this.updateCamera(deltaTime);
            this.scene.update(currentTime, deltaTime);


            for (let mesh of this.scene.meshes) {

                this.drawMesh(mesh);
            }

            this.drawTriangles();

            requestAnimationFrame(mainLoop);
        };

        requestAnimationFrame(mainLoop);
    }

    private drawMesh(mesh: Mesh): void {

        for (let triangle of mesh.triangles) {

            const rotXMatrix = MatrixUtils.rotationXMatrix(mesh.roation.x);
            const rotZMatrix = MatrixUtils.rotationZMatrix(mesh.roation.z);
            const translationMatrix = MatrixUtils.translationMatrix(mesh.translation);

            let worldMatrix = MatrixUtils.newIdentityMatrix4x4();
            worldMatrix = MatrixUtils.multiplyMatrix(worldMatrix, rotZMatrix);
            worldMatrix = MatrixUtils.multiplyMatrix(worldMatrix, rotXMatrix);
            worldMatrix = MatrixUtils.multiplyMatrix(worldMatrix, translationMatrix);

            const transformedTriangle = MatrixUtils.multiplyTriangle(triangle, worldMatrix);
            const normal = TriangleUtils.calcNormal(transformedTriangle);
            const cameraRay = VectorUtils.sub(transformedTriangle.p1, this.camera.position);

            if (VectorUtils.dotProduct(normal, cameraRay) < 0.0) {

                // ambient light
                const lightDirection = VectorUtils.normalise(this.scene.ambientLight);
                const shade = Math.max(0.3, VectorUtils.dotProduct(normal, lightDirection));
                transformedTriangle.color.shade(shade);

                const up = new Vec3D(0, 1, 0);
                let target = new Vec3D(0, 0, 1);
                const cameraRotMatrix = MatrixUtils.rotationYMatrix(this.yaw);
                this.lookDir = MatrixUtils.multiplyVector(target, cameraRotMatrix);
                target = VectorUtils.add(this.camera.position, this.lookDir);
                const cameraMatrix = MatrixUtils.pointAt(this.camera.position, target, up);

                const viewMatrix = MatrixUtils.quickInverse(cameraMatrix);

                // Convert world space to view space
                const viewedTriangle = MatrixUtils.multiplyTriangle(transformedTriangle, viewMatrix);

                let clippedTriangles = 0;
                let clipped = new Array<Triangle>(new Triangle(), new Triangle());

                clippedTriangles = VectorUtils.triangleClipAgainstPlane(
                    new Vec3D(0.0, 0.0, 0.1),
                    new Vec3D(0.0, 0.0, 1.0),
                    viewedTriangle,
                    clipped[0],
                    clipped[1]
                );

                for (let n = 0; n < clippedTriangles; n++) {

                    // Convert 3D to 2D
                    const projectedTriangle = MatrixUtils.multiplyTriangle(clipped[n], this.projectionMatrix);

                    for (let point of projectedTriangle.points) {

                        point.x /= point.w;
                        point.y /= point.w;
                        point.z /= point.w;
                    }

                    // Scale to screen size
                    for (let point of projectedTriangle.points) {

                        point.x += 1.0;
                        point.y += 1.0;
                        point.x *= 0.5 * this.config.resolution.width;
                        point.y *= 0.5 * this.config.resolution.height;
                    }

                    //console.log(triangle.color, projectedTriangle.color);
                    this.trianglesToRaster.push(projectedTriangle);
                }
            }
        }
    }

    private triangleSortFunction(t1: Triangle, t2: Triangle): number {

        const z1 = (t1.p1.z + t1.p2.z + t1.p3.z) / 3.0;
        const z2 = (t2.p1.z + t2.p2.z + t2.p3.z) / 3.0;
        return z2 < z1 ? -1 : z2 > z1 ? 1 : 0;
    }

    private drawTriangles(): void {

        // TODO: clip other planes

        for (let triangle of this.trianglesToRaster.sort(this.triangleSortFunction)) {

            CanvasUtils.drawTriangle(this.context!, triangle);
        }
    }

    private updateCamera(deltaTime: number): void {

        if (this.keyboard.key(KEYS.ARROW_UP)) {
            this.camera.position.y += 8 * deltaTime;
        }

        if (this.keyboard.key(KEYS.ARROW_DOWN)) {
            this.camera.position.y -= 8 * deltaTime;
        }

        if (this.keyboard.key(KEYS.ARROW_LEFT)) {
            this.camera.position.x -= 8 * deltaTime;
        }

        if (this.keyboard.key(KEYS.ARROW_RIGHT)) {
            this.camera.position.x += 8 * deltaTime;
        }

        const forward = VectorUtils.mul(this.lookDir, 8 * deltaTime)

        if (this.keyboard.key(KEYS.KEY_W)) {
            this.camera.position = VectorUtils.add(this.camera.position, forward);
        }

        if (this.keyboard.key(KEYS.KEY_S)) {
            this.camera.position = VectorUtils.sub(this.camera.position, forward);
        }

        if (this.keyboard.key(KEYS.KEY_A)) {
            this.yaw += 2 * deltaTime;
        }

        if (this.keyboard.key(KEYS.KEY_D)) {
            this.yaw -= 2 * deltaTime;
        }
    }
}
