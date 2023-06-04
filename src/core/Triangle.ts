import { Color } from "./Color";
import { Vec3D } from "./Vect3D";

export class Triangle {

    public get p1() { return this.points[0]; }
    public get p2() { return this.points[1]; }
    public get p3() { return this.points[2]; }

    constructor(
        public points: Array<Vec3D> = new Array<Vec3D>(
            new Vec3D(), new Vec3D(), new Vec3D()
        ),
        public color: Color = Color.RED,
    ) { }

    public clone(): Triangle {

        return new Triangle(
            [
                new Vec3D(this.p1.x, this.p1.y, this.p1.z),
                new Vec3D(this.p2.x, this.p2.y, this.p2.z),
                new Vec3D(this.p3.x, this.p3.y, this.p3.z),
            ],
            this.color
        );
    }
}
