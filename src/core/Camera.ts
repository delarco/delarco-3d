export class Camera {

    public fovRad: number;

    constructor(
        public fov: number = 90.0,
        public aspectRatio: number = 0.75,
        public near: number = 0.1,
        public far: number = 1000.0,
    ) {

        this.fovRad = 1.0 / Math.tan(fov * 0.5 / 180.0 * Math.PI);
    }
}
