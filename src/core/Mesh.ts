import { Triangle } from "./Triangle";

export class Mesh {

    constructor(
        public name: string = '',
        public triangles = new Array<Triangle>()
    ) {}
}
