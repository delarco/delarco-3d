import { Color } from "../core/Color";
import { Mesh } from "../core/Mesh";
import { Triangle } from "../core/Triangle";
import { Vec2D } from "../core/Vect2D";
import { Vec3D } from "../core/Vect3D";

export class WavefrontObjLoader {

    public static async loadFile(filename: string, defaultColor = Color.RED): Promise<Mesh | null> {

        const data = await fetch(filename)
        .then(res => res.text())
        .then(data => data)
        .catch(ex => console.log(ex) )      

        if(!data) return null;

        const ret = new Mesh();

        const points: Array<Vec3D> = [new Vec3D(),];
        const faces = [];

        for (let line of data.split('\n')) {

            while(line.indexOf('  ') >= 0) line = line.replace('  ', ' ');
            
            const lineData = line.split(' ');

            if (lineData[0] == 'v') {

                points.push(new Vec3D(
                    parseFloat(lineData[1]),
                    parseFloat(lineData[2]),
                    parseFloat(lineData[3]),
                ));
            }

            if (lineData[0] == 'f') {

                const face = [];
                face.push(parseInt(lineData[1].split('/')[0]));
                face.push(parseInt(lineData[2].split('/')[0]));
                face.push(parseInt(lineData[3].split('/')[0]));

                if (lineData.length == 5) {

                    face.push(parseInt(lineData[4].split('/')[0]));
                }

                faces.push(face);
            }
        }

        for (let face of faces) {

            ret.triangles.push(new Triangle([
                points[face[0]],
                points[face[1]],
                points[face[2]]
            ], [
                new Vec2D(), new Vec2D(), new Vec2D(),
            ], defaultColor
            ));

            if (face.length == 4) {

                ret.triangles.push(new Triangle([
                    points[face[2]],
                    points[face[3]],
                    points[face[0]]
                ], [
                    new Vec2D(), new Vec2D(), new Vec2D(),
                ], defaultColor
                ))
            }
        }

        return ret;
    }
} 