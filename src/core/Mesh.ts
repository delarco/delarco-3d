import { Triangle } from "./Triangle";
import { Vec3D } from "./Vect3D";

export class Mesh {

    constructor(
        public name: string = '',
        public triangles = new Array<Triangle>(),
        public roation = new Vec3D(),
        public translation = new Vec3D(),
    ) {}
}
