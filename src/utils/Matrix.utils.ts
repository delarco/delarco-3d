import { Camera } from "../core/Camera";
import { Matrix4x4 } from "../core/Matrix4x4";
import { Triangle } from "../core/Triangle";
import { Vec3D } from "../core/Vect3D";

export class MatrixUtils {

    public static newMatrix4x4(): Matrix4x4 {

        return [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ]
    }

    public static newIdentityMatrix4x4(): Matrix4x4 {

        return [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ]
    }

    public static createProjectionMatrix(camera: Camera): Matrix4x4 {

        const projectionMat = MatrixUtils.newMatrix4x4();

        projectionMat[0][0] = camera.aspectRatio * camera.fovRad;
        projectionMat[1][1] = camera.fovRad;
        projectionMat[2][2] = camera.far / (camera.far - camera.near);
        projectionMat[3][2] = (-camera.far * camera.near) / (camera.far - camera.near);
        projectionMat[2][3] = 1.0;
        projectionMat[3][3] = 0.0;

        return projectionMat;
    }

    public static multiplyVector(i: Vec3D, m: Matrix4x4): Vec3D {

        return new Vec3D(
            i.x * m[0][0] + i.y * m[1][0] + i.z * m[2][0] + i.w * m[3][0],
            i.x * m[0][1] + i.y * m[1][1] + i.z * m[2][1] + i.w * m[3][1],
            i.x * m[0][2] + i.y * m[1][2] + i.z * m[2][2] + i.w * m[3][2],
            i.x * m[0][3] + i.y * m[1][3] + i.z * m[2][3] + i.w * m[3][3],
        );
    }

    public static multiplyTriangle(tri: Triangle, m: Matrix4x4): Triangle {

        return new Triangle(
            [
                MatrixUtils.multiplyVector(tri.p1, m),
                MatrixUtils.multiplyVector(tri.p2, m),
                MatrixUtils.multiplyVector(tri.p3, m),
            ],
            tri.color.clone()
        );
    }

    public static multiplyMatrix(m1: Matrix4x4, m2: Matrix4x4) {

        const mat = MatrixUtils.newMatrix4x4();

        for (let c = 0; c < 4; c++)
            for (let r = 0; r < 4; r++)
                mat[r][c] = m1[r][0] * m2[0][c] + m1[r][1] * m2[1][c] + m1[r][2] * m2[2][c] + m1[r][3] * m2[3][c];

        return mat;
    }

    public static rotationXMatrix(angle: number): Matrix4x4 {

        const rotMat = MatrixUtils.newMatrix4x4();
        rotMat[0][0] = 1;
        rotMat[1][1] = Math.cos(angle * 0.5);
        rotMat[1][2] = Math.sin(angle * 0.5);
        rotMat[2][1] = -Math.sin(angle * 0.5);
        rotMat[2][2] = Math.cos(angle * 0.5);
        rotMat[3][3] = 1;

        return rotMat;
    }

    public static rotationYMatrix(angle: number): Matrix4x4 {

        const rotMat = MatrixUtils.newMatrix4x4();
        rotMat[0][0] = Math.cos(angle);
        rotMat[0][2] = Math.sin(angle);
        rotMat[2][0] = -Math.sin(angle);
        rotMat[1][1] = 1.0;
        rotMat[2][2] = Math.cos(angle);
        rotMat[3][3] = 1.0;

        return rotMat;
    }

    public static rotationZMatrix(angle: number): Matrix4x4 {

        const rotMat = MatrixUtils.newMatrix4x4();
        rotMat[0][0] = Math.cos(angle);
        rotMat[0][1] = Math.sin(angle);
        rotMat[1][0] = -Math.sin(angle);
        rotMat[1][1] = Math.cos(angle);
        rotMat[2][2] = 1;
        rotMat[3][3] = 1;

        return rotMat;
    }

    public static translationMatrix(t: Vec3D): Matrix4x4 {

        const matrix = MatrixUtils.newMatrix4x4();
        matrix[0][0] = 1.0;
        matrix[1][1] = 1.0;
        matrix[2][2] = 1.0;
        matrix[3][3] = 1.0;
        matrix[3][0] = t.x;
        matrix[3][1] = t.y;
        matrix[3][2] = t.z;

        return matrix;
    }
}
