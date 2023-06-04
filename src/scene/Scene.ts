import { Mesh } from "../core/Mesh";
import { SceneConfig } from "./SceneConfig";

export class Scene {

    public meshes: Array<Mesh>;

    constructor(config: SceneConfig = new SceneConfig()) {

        this.meshes = Array<Mesh>();
    }

    public preload(): void {

    }

    public initialize(): void {

    }

    public update(time: number, deltaTime: number): void {

    }
}
