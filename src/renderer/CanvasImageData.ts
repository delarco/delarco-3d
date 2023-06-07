import { Color } from "../core/Color";
import { Size } from "../core/Size";
import { Texture } from "../core/Texture";
import { Triangle } from "../core/Triangle";
import { Vec3D } from "../core/Vect3D";

export class CanvasImageData {

    constructor(
        private size: Size,
        private colorBuffer: Uint8ClampedArray,
        private depthBuffer: Array<number>
    ){}

    public clear(color: Color): void {

        for (let y = 0; y < this.size.height; y++) {

            for (let x = 0; x < this.size.width; x++) {

                const index = 4 * (y * this.size.width + x);
                this.colorBuffer[index + 0] = color.r;
                this.colorBuffer[index + 1] = color.g;
                this.colorBuffer[index + 2] = color.b;
                this.colorBuffer[index + 3] = color.a;

                const depthIndex = (y * this.size.width + x);
                this.depthBuffer[depthIndex] = 1000.0;
            }
        }
    }

    public drawPixel(x: number, y: number, color: Color): void {

        const index = 4 * ((this.size.height - y - 1) * this.size.width + x);
        this.colorBuffer[index + 0] = color.r;
        this.colorBuffer[index + 1] = color.g;
        this.colorBuffer[index + 2] = color.b;
        this.colorBuffer[index + 3] = color.a;
    }

    public drawLine(v1: Vec3D, v2: Vec3D, color: Color): void {

        const diffX = v2.x - v1.x;
        const diffY = v2.y - v1.y;
        const steps = Math.abs(diffX) > Math.abs(diffY) ? Math.abs(diffX) : Math.abs(diffY);
        const xInc = diffX / steps;
        const yInc = diffY / steps;

        for (let step = 0; step < steps; step++) {

            const x = Math.floor(v1.x + xInc * step);
            const y = Math.floor(v1.y + yInc * step);

            if(x < 0 || y < 0 || x >= this.size.width || y >= this.size.height) return;

            this.drawPixel(x, y, color);
        }
    }

    public drawTriangleWireFrame(triangle: Triangle, color?: Color): void {

        this.drawLine(triangle.p1, triangle.p2, color || triangle.color);
        this.drawLine(triangle.p2, triangle.p3, color || triangle.color);
        this.drawLine(triangle.p3, triangle.p1, color || triangle.color);
    }

    public drawTexture(texture: Texture, x: number, y: number): void {

        for(let ty = 0; ty < texture.height; ty++) {

            for(let tx = 0; tx < texture.width; tx++) {

                this.drawPixel(x + tx, y + ty, texture.getPixelColor(tx, ty));
            }
        }
    }
}
