import { Camera } from "../core/Camera";
import { Matrix4x4 } from "../core/Matrix4x4";

export class MatrixUtils {

    public static newMatrix4x4(): Matrix4x4 {

        return [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
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
}
