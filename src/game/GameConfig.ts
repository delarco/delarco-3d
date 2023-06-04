import { Camera } from "../core/Camera";
import { Size } from "../core/Size";

export class GameConfig {

    public viewPort: Size = { width: 800, height: 600 };
    public resolution: Size = { width: 360, height: 240 };
    public camera: Camera = new Camera(90, this.resolution.height / this.resolution.width);
}
