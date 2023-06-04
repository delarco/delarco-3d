import { Mesh } from "../core/Mesh";
import { SceneConfig } from "./SceneConfig";

export class Scene {

    private config: SceneConfig;
    public meshes: Array<Mesh>;

    public get ambientLight() { return this.config.ambientLight; }

    constructor(config: SceneConfig = new SceneConfig()) {

        this.config = config;
        this.meshes = Array<Mesh>();
    }

    public preload(): void {

    }

    public initialize(): void {

    }

    public update(time: number, deltaTime: number): void {

    }
}
