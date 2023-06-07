import { Camera } from "../core/Camera";
import { Color } from "../core/Color";
import { Matrix4x4 } from "../core/Matrix4x4";
import { Mesh } from "../core/Mesh";
import { Texture } from "../core/Texture";
import { Triangle } from "../core/Triangle";
import { Vec3D } from "../core/Vect3D";
import { Keyboard, KEYS } from "../input/Keyboard";
import { CanvasImageData } from "../renderer/CanvasImageData";
import { Scene } from "../scene/Scene";
import { Clock } from "../utils/Clock";
import { MatrixUtils } from "../utils/Matrix.utils";
import { TriangleUtils } from "../utils/Triangle.utils";
import { VectorUtils } from "../utils/Vector.utils";
import { GameConfig } from "./GameConfig";

export class Game {

    private config: GameConfig;
    private canvas: HTMLCanvasElement;
    private imageData: ImageData;
    private colorBuffer: Uint8ClampedArray;
    private depthBuffer: Array<number>;
    private context: CanvasRenderingContext2D | null;
    private clock = new Clock();
    private camera: Camera;

    public get domElement() { return this.canvas; }

    public scene: Scene;

    private projectionMatrix: Matrix4x4;

    private backgroundColor = new Color(204, 204, 204);

    private previousTime = 0;

    private keyboard: Keyboard;

    private lookDir = new Vec3D(0, 0, 0);
    private yaw = 0;

    private renderer: CanvasImageData;

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

        this.imageData = this.context.getImageData(0, 0, config.resolution.width, config.resolution.height);
        this.colorBuffer = this.imageData.data;
        this.depthBuffer = new Array<number>(config.resolution.width * config.resolution.height);
        this.renderer = new CanvasImageData(config.resolution, this.colorBuffer, this.depthBuffer);
        this.renderer.clear(this.backgroundColor);

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

            this.renderer.clear(this.backgroundColor);

            this.updateCamera(deltaTime);
            this.scene.update(currentTime, deltaTime);

            for (let mesh of this.scene.meshes) {

                this.drawMesh(mesh);
            }

            this.context?.putImageData(this.imageData, 0, 0);
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

                    this.drawTexturedTriangle(
                        projectedTriangle.p1.x, projectedTriangle.p1.y, projectedTriangle.t1.u, projectedTriangle.t1.v, projectedTriangle.t1.w,
                        projectedTriangle.p2.x, projectedTriangle.p2.y, projectedTriangle.t2.u, projectedTriangle.t2.v, projectedTriangle.t2.w,
                        projectedTriangle.p3.x, projectedTriangle.p3.y, projectedTriangle.t3.u, projectedTriangle.t3.v, projectedTriangle.t3.w,
                        mesh.texture, projectedTriangle.color
                    );

                    //this.renderer.drawTriangleWireFrame(projectedTriangle, Color.BLACK);
                }
            }
        }
    }

    private drawTexturedTriangle(
        x1: number, y1: number, u1: number, v1: number, w1: number,
        x2: number, y2: number, u2: number, v2: number, w2: number,
        x3: number, y3: number, u3: number, v3: number, w3: number,
        tex: Texture | null, defaultColor: Color): void {
        //console.log(defaultColor);

        x1 = Math.floor(x1);
        x2 = Math.floor(x2);
        x3 = Math.floor(x3);
        y1 = Math.floor(y1);
        y2 = Math.floor(y2);
        y3 = Math.floor(y3);

        if (y2 < y1) {
            [y1, y2] = [y2, y1];
            [x1, x2] = [x2, x1];
            [u1, u2] = [u2, u1];
            [v1, v2] = [v2, v1];
            [w1, w2] = [w2, w1];
        }

        if (y3 < y1) {
            [y1, y3] = [y3, y1];
            [x1, x3] = [x3, x1];
            [u1, u3] = [u3, u1];
            [v1, v3] = [v3, v1];
            [w1, w3] = [w3, w1];
        }

        if (y3 < y2) {
            [y3, y2] = [y2, y3];
            [x3, x2] = [x2, x3];
            [u3, u2] = [u2, u3];
            [v3, v2] = [v2, v3];
            [w3, w2] = [w2, w3];
        }

        let dy1 = y2 - y1;
        let dx1 = x2 - x1;
        let dv1 = v2 - v1;
        let du1 = u2 - u1;
        let dw1 = w2 - w1;

        let dy2 = y3 - y1;
        let dx2 = x3 - x1;
        let dv2 = v3 - v1;
        let du2 = u3 - u1;
        let dw2 = w3 - w1;

        let tex_u = 0, tex_v = 0, tex_w = 0;

        let dax_step = 0, dbx_step = 0,
            du1_step = 0, dv1_step = 0,
            du2_step = 0, dv2_step = 0,
            dw1_step = 0, dw2_step = 0;

        if (dy1) dax_step = dx1 / Math.abs(dy1);
        if (dy2) dbx_step = dx2 / Math.abs(dy2);
        if (dy1) du1_step = du1 / Math.abs(dy1);
        if (dy1) dv1_step = dv1 / Math.abs(dy1);
        if (dy1) dw1_step = dw1 / Math.abs(dy1);
        if (dy2) du2_step = du2 / Math.abs(dy2);
        if (dy2) dv2_step = dv2 / Math.abs(dy2);
        if (dy2) dw2_step = dw2 / Math.abs(dy2);

        if (dy1) {
            for (let i = y1; i <= y2; i++) {

                let ax = Math.floor(x1 + (i - y1) * dax_step);
                let bx = Math.floor(x1 + (i - y1) * dbx_step);

                let tex_su = u1 + (i - y1) * du1_step;
                let tex_sv = v1 + (i - y1) * dv1_step;
                let tex_sw = w1 + (i - y1) * dw1_step;

                let tex_eu = u1 + (i - y1) * du2_step;
                let tex_ev = v1 + (i - y1) * dv2_step;
                let tex_ew = w1 + (i - y1) * dw2_step;

                if (ax > bx) {
                    [ax, bx] = [bx, ax];
                    [tex_su, tex_eu] = [tex_eu, tex_su];
                    [tex_sv, tex_ev] = [tex_ev, tex_sv];
                    [tex_sw, tex_ew] = [tex_ew, tex_sw];
                }

                tex_u = tex_su;
                tex_v = tex_sv;
                tex_w = tex_sw;

                let tstep = 1.0 / ((bx - ax));
                let t = 0.0;

                for (let j = ax; j < bx; j++) {
                    tex_u = (1.0 - t) * tex_su + t * tex_eu;
                    tex_v = (1.0 - t) * tex_sv + t * tex_ev;
                    tex_w = (1.0 - t) * tex_sw + t * tex_ew;

                    if (tex_w > this.depthBuffer[i * this.config.resolution.width + j]) {

                        let color = defaultColor;
                        if (tex) color = tex.sampleColor(tex_u / tex_w, tex_v / tex_w);
                        this.renderer.drawPixel(j, i, color);
                        this.depthBuffer[i * this.config.resolution.width + j] = tex_w;
                    }
                    t += tstep;
                }

            }
        }

        dy1 = y3 - y2;
        dx1 = x3 - x2;
        dv1 = v3 - v2;
        du1 = u3 - u2;
        dw1 = w3 - w2;

        if (dy1) dax_step = dx1 / Math.abs(dy1);
        if (dy2) dbx_step = dx2 / Math.abs(dy2);

        du1_step = 0, dv1_step = 0;
        if (dy1) du1_step = du1 / Math.abs(dy1);
        if (dy1) dv1_step = dv1 / Math.abs(dy1);
        if (dy1) dw1_step = dw1 / Math.abs(dy1);

        if (dy1) {
            for (let i = y2; i <= y3; i++) {

                let ax = Math.floor(x2 + (i - y2) * dax_step);
                let bx = Math.floor(x1 + (i - y1) * dbx_step);

                let tex_su = u2 + (i - y2) * du1_step;
                let tex_sv = v2 + (i - y2) * dv1_step;
                let tex_sw = w2 + (i - y2) * dw1_step;

                let tex_eu = u1 + (i - y1) * du2_step;
                let tex_ev = v1 + (i - y1) * dv2_step;
                let tex_ew = w1 + (i - y1) * dw2_step;

                if (ax > bx) {
                    [ax, bx] = [bx, ax];
                    [tex_su, tex_eu] = [tex_eu, tex_su];
                    [tex_sv, tex_ev] = [tex_ev, tex_sv];
                    [tex_sw, tex_ew] = [tex_ew, tex_sw];
                }

                tex_u = tex_su;
                tex_v = tex_sv;
                tex_w = tex_sw;

                let tstep = 1.0 / (bx - ax);
                let t = 0.0;

                for (let j = ax; j < bx; j++) {
                    tex_u = (1.0 - t) * tex_su + t * tex_eu;
                    tex_v = (1.0 - t) * tex_sv + t * tex_ev;
                    tex_w = (1.0 - t) * tex_sw + t * tex_ew;

                    if (tex_w > this.depthBuffer[i * this.config.resolution.width + j]) {

                        let color = defaultColor;
                        if (tex) color = tex.sampleColor(tex_u / tex_w, tex_v / tex_w);
                        this.renderer.drawPixel(j, i, color);
                        this.depthBuffer[i * this.config.resolution.width + j] = tex_w;
                    }
                    t += tstep;
                }
            }
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
