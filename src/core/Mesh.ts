import { TextureUtils } from "../utils/Texture.utils";
import { Color } from "./Color";
import { Triangle } from "./Triangle";
import { Vec3D } from "./Vect3D";

export class Mesh {

    constructor(
        public name: string = '',
        public triangles = new Array<Triangle>(),
        public roation = new Vec3D(),
        public translation = new Vec3D(),
        public texture = TextureUtils.make('', 32, 32, Color.RED)
    ) {}
}
