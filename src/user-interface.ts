import { IUserInterface } from "./core/UserInterface";
import { Scene } from "./scene/Scene";
import { TextureUtils } from "./utils/Texture.utils";

const textureList = [
    'Bump_2K.png',
    'Clouds_2K.png',
    'Diffuse_2K.png',
    'Night_lights_2K.png',
    'Ocean_Mask_2K.png',
];

export class UserInterface implements IUserInterface {

    private defaultTexture = 'Diffuse_2K.png';
    public wireframe: boolean = false;
    public fpsElement = document.querySelector<HTMLSpanElement>("#fps")!;
    private wireframeElement = document.querySelector<HTMLInputElement>("#wireframe")!;
    private textureListElement = document.querySelector<HTMLUListElement>("ul.textures")!;
    private selecedTexture: HTMLLIElement;

    constructor(gameScene: Scene) {

        this.wireframeElement.addEventListener("change", ev => this.wireframe = (<HTMLInputElement>ev.target).checked);

        for(let texture of textureList) {

            const li = document.createElement("li");
            li.innerText = texture;

            if(texture == this.defaultTexture) {
                this.selecedTexture = li;
                li.className = "active";
            }

            li.addEventListener("click", async ev => {

                this.selecedTexture.className = "";
                this.selecedTexture = <HTMLLIElement>ev.target;
                this.selecedTexture.className = "active";
                gameScene.meshes[0].texture = await TextureUtils.loadTexture(`textures/${texture}`);
            });

            this.textureListElement.appendChild(li);
        }
        
    }
}
