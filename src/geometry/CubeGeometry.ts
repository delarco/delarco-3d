import { Mesh } from "../core/Mesh";
import { Triangle } from "../core/Triangle";
import { Vec3D } from "../core/Vect3D";

export class CubeGeometry extends Mesh {

    constructor(size: number = 1) {
        super();

        this.triangles = [

            // SOUTH
            new Triangle([
                new Vec3D(0, 0, 0),
                new Vec3D(0, size, 0),
                new Vec3D(size, size, 0)
            ]),
            new Triangle([
                new Vec3D(0, 0, 0),
                new Vec3D(size, size, 0),
                new Vec3D(size, 0, 0)
            ]),

            // EAST
            new Triangle([
                new Vec3D(size, 0, 0),
                new Vec3D(size, size, 0),
                new Vec3D(size, size, size)
            ]),
            new Triangle([
                new Vec3D(size, 0, 0),
                new Vec3D(size, size, size),
                new Vec3D(size, 0, size)
            ]),

            // NORTH
            new Triangle([
                new Vec3D(size, 0, size),
                new Vec3D(size, size, size),
                new Vec3D(0, size, size)
            ]),
            new Triangle([
                new Vec3D(size, 0, size),
                new Vec3D(0, size, size),
                new Vec3D(0, 0, size)
            ]),

            // WEST
            new Triangle([
                new Vec3D(0, 0, size),
                new Vec3D(0, size, size),
                new Vec3D(0, size, 0)
            ]),
            new Triangle([
                new Vec3D(0, 0, size),
                new Vec3D(0, size, 0),
                new Vec3D(0, 0, 0)
            ]),

            // TOP
            new Triangle([
                new Vec3D(0, size, 0),
                new Vec3D(0, size, size),
                new Vec3D(size, size, size)
            ]),
            new Triangle([
                new Vec3D(0, size, 0),
                new Vec3D(size, size, size),
                new Vec3D(size, size, 0)
            ]),

            // BOTTOM
            new Triangle([
                new Vec3D(size, 0, size),
                new Vec3D(0, 0, size),
                new Vec3D(0, 0, 0)
            ]),
            new Triangle([
                new Vec3D(size, 0, size),
                new Vec3D(0, 0, 0),
                new Vec3D(size, 0, 0)
            ]),
        ];
    }
}
