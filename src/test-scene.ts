import { CubeGeometry } from "./geometry/CubeGeometry";
import { Scene } from "./scene/Scene";

export class TestScene extends Scene {

    public async preload(): Promise<void> {

        this.meshes.push(new CubeGeometry(1))
    }

    public initialize(): void {

        this.meshes[0].translation.z = 3;
    }

    public update(time: number, deltaTime: number): void {

    }
}
