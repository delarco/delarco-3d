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
}
