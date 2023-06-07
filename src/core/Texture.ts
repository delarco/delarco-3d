import { Color } from "./Color";

export class Texture {

    constructor(
        public name: string,
        public width: number = 32,
        public height: number = 32,
        public data: Array<Color> = [...new Array(width * height).keys()].map(() => new Color())
    ) { }

    public drawPixel(x: number, y: number, color: Color): void {

        let index = (y * this.width + x);
        this.data[index] = color;
    }

    public getPixelColor(x: number, y: number): Color {

        return this.data[y * this.width + x];
    }

    public sampleColor(x: number, y: number): Color {

        let sx = Math.floor(x * this.width);
        let sy = Math.floor(y * this.height - 1.0);

        if (sx < 0) sx = 0;
        if (sx >= this.width) sx = this.width - 1;
        if (sy < 0) sy = 0;
        if (sy >= this.height) sy = this.height - 1;

        return this.getPixelColor(sx, sy);
    }
}
