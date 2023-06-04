import { CubeGeometry } from "./geometry/CubeGeometry";
import { Scene } from "./scene/Scene";

export class TestScene extends Scene {

    public preload(): void {

        this.meshes.push(new CubeGeometry());
    }

    public initialize(): void {

        for (let tri of this.meshes[0].triangles) {

            for (let p of tri.points) p.z += 3;
        }
    }

    public update(time: number, deltaTime: number): void {


    }
}
