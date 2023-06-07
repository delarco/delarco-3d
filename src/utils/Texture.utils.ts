import { Color } from "../core/Color";
import { Texture } from "../core/Texture";

export class TextureUtils {

    public static make(name: string, width: number, height: number, color: Color): Texture {

        const data = [...new Array(32 * 32).keys()].map(() => color);
        return new Texture(name, width, height, data);
    }

    public static makeTestTexture(name: string, width: number, height: number): Texture {

        const texture = new Texture(name, width, height, new Array<Color>());

        for (let y = 0; y < height; y++) {

            for (let x = 0; x < width; x++) {

                let color = new Color(255, 255, 255);

                if (x == 0 && y != 0) color = Color.RED;

                if (y == 0 && x != 0) color = Color.GREEN;

                if (x == width - 1 && y != 0) color = Color.BLUE;

                if (y == height - 1 && x != 0) color = Color.ORANGE;

                if (
                    (x == 0 && y == 0)
                    || (x == width - 1 && y == 0)
                    || (x == 0 && y == height - 1)
                    || (x == width - 1 && y == height - 1)
                    || (x == y)
                    || (x == 2 && y == 1)
                    || (x == 1 && y == 2)
                ) color = Color.BLACK;

                texture.data.push(color);
            }
        }

        return texture;
    }
}
