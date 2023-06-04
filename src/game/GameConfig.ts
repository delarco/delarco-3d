import { Camera } from "../core/Camera";
import { Size } from "../core/Size";

export class GameConfig {

    public viewPort: Size = { width: 640, height: 480 };
    public resolution: Size = { width: 640, height: 480 };
    public camera: Camera = new Camera();
}
