import { CubeGeometry } from "./geometry/CubeGeometry";
import { Scene } from "./scene/Scene";
import { WavefrontObjLoader } from "./utils/WavefrontObjLoader";

export class TestScene extends Scene {

    public async preload(): Promise<void> {

        const lamp = await WavefrontObjLoader.loadFile('/models/lamp.obj');

        if (lamp) this.meshes.push(lamp);

        this.meshes.push(new CubeGeometry(1))
    }

    public initialize(): void {

        this.meshes[0].translation.z = 9;
        this.meshes[0].translation.y = 3;
        this.meshes[1].translation.z = 9;
        this.meshes[0].roation.z = 3.14;
    }

    public update(time: number, deltaTime: number): void {

        for (let mesh of this.meshes) {

            mesh.roation.x += 1.0 * deltaTime;
            mesh.roation.z += 1.0 * deltaTime;
        }
    }
}
