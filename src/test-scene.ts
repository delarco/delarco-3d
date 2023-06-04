import { CubeGeometry } from "./geometry/CubeGeometry";
import { Scene } from "./scene/Scene";

export class TestScene extends Scene {

    public preload(): void {

        this.meshes.push(new CubeGeometry());
    }

    public initialize(): void {

        this.meshes[0].translation.z = 3;
    }

    public update(time: number, deltaTime: number): void {

        this.meshes[0].roation.x += 0.1;
    }
}
