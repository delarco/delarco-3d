import { Color } from "./Color";
import { Vec2D } from "./Vect2D";
import { Vec3D } from "./Vect3D";

export class Triangle {

    public get p1() { return this.points[0]; }
    public get p2() { return this.points[1]; }
    public get p3() { return this.points[2]; }

    constructor(
        public points: Array<Vec3D> = new Array<Vec3D>(
            new Vec3D(), new Vec3D(), new Vec3D()
        ),
        public tex: Array<Vec2D> = new Array<Vec2D>(
            new Vec2D(), new Vec2D(), new Vec2D()
        ),
        public color: Color = Color.RED,
    ) { }
}
