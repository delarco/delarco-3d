import { Vec3D } from "../core/Vect3D";

export class VectorUtils {

    public static dotProduct(v1: Vec3D, v2: Vec3D): number {

        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z ;
    }

    public static vectorLength(v: Vec3D): number {

        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    }
}
