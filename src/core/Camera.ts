export class Camera {

    constructor(
        public fov: number = 90.0,
        public aspectRatio: number = 0.75,
        public near: number = 0.1,
        public far: number = 1000.0,
    ) { }
}
