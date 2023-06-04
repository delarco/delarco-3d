import { CubeGeometry } from "./geometry/CubeGeometry";
import { Scene } from "./scene/Scene";

export class TestScene extends Scene {

    public preload(): void {

        this.meshes.push(new CubeGeometry());
    }

    public update(time: number, deltaTime: number): void {

        
    }
}
