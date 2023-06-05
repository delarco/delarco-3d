import { Triangle } from "../core/Triangle";
import { Vec3D } from "../core/Vect3D";
import { VectorUtils } from "./Vector.utils";

export class TriangleUtils {

    public static clone(triangle: Triangle): Triangle {

        return new Triangle(
            [
                new Vec3D(triangle.p1.x, triangle.p1.y, triangle.p1.z),
                new Vec3D(triangle.p2.x, triangle.p2.y, triangle.p2.z),
                new Vec3D(triangle.p3.x, triangle.p3.y, triangle.p3.z),
            ],
            triangle.color
        );
    }

    public static calcNormal(triangle: Triangle): Vec3D {

        const line1 = new Vec3D(
            triangle.p2.x - triangle.p1.x,
            triangle.p2.y - triangle.p1.y,
            triangle.p2.z - triangle.p1.z,
        );

        const line2 = new Vec3D(
            triangle.p3.x - triangle.p1.x,
            triangle.p3.y - triangle.p1.y,
            triangle.p3.z - triangle.p1.z,
        );

        const normal = VectorUtils.crossProduct(line1, line2);
        return VectorUtils.normalise(normal);
    }
}
