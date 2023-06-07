import { Color } from "./core/Color";
import { Scene } from "./scene/Scene";
import { TextureUtils } from "./utils/Texture.utils";
import { WavefrontObjLoader } from "./utils/WavefrontObjLoader";


export class TestScene extends Scene {

    public async preload(): Promise<void> {

        await this.addObj('models/Earth_2K.obj', 'textures/Diffuse_2K.png');
    }

    private async addObj(filename: string, texture?: string): Promise<void> {

        const mesh = await WavefrontObjLoader.loadFile(filename, Color.RED);

        if (mesh){

            if(texture) mesh.texture = await TextureUtils.loadTexture(texture);
            this.meshes.push(mesh);
        }
    }

    public initialize(): void {

        this.meshes[0].translation.z = 5;
    }

    public update(time: number, deltaTime: number): void {

        this.meshes[0].roation.x += 1 * deltaTime;
        this.meshes[0].roation.z += 1 * deltaTime;
    }
}
