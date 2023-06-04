import { Triangle } from "../core/Triangle";
import { Vec3D } from "../core/Vect3D";

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

        const normal = new Vec3D(
            line1.y * line2.z - line1.z * line2.y,
            line1.z * line2.x - line1.x * line2.z,
            line1.x * line2.y - line1.y * line2.x
        );

        // Normalise
        const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);
        normal.x /= length;
        normal.y /= length;
        normal.z /= length;

        return normal;
    }
}
