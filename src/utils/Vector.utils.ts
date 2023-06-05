import { Vec3D } from "../core/Vect3D";

export class VectorUtils {

    public static dotProduct(v1: Vec3D, v2: Vec3D): number {

        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }

    public static vectorLength(v: Vec3D): number {

        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    }

    public static add(v1: Vec3D, v2: Vec3D): Vec3D {

        return new Vec3D(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }

    public static sub(v1: Vec3D, v2: Vec3D): Vec3D {

        return new Vec3D(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }

    public static mul(v1: Vec3D, k: number): Vec3D {

        return new Vec3D(v1.x * k, v1.y * k, v1.z * k);
    }

    public static div(v1: Vec3D, k: number): Vec3D {

        return new Vec3D(v1.x / k, v1.y / k, v1.z / k);
    }

    public static normalise(v: Vec3D): Vec3D {

        const len = VectorUtils.vectorLength(v);
        return new Vec3D(v.x / len, v.y / len, v.z / len);
    }

    public static crossProduct(v1: Vec3D, v2: Vec3D): Vec3D {

        return new Vec3D(
            v1.y * v2.z - v1.z * v2.y,
            v1.z * v2.x - v1.x * v2.z,
            v1.x * v2.y - v1.y * v2.x
        );
    }
}
