import { Color } from "../core/Color";
import { Mesh } from "../core/Mesh";
import { Triangle } from "../core/Triangle";
import { Vec2D } from "../core/Vect2D";
import { Vec3D } from "../core/Vect3D";

interface FacePoint {
    v: number;
    vt: number | null;
    vn: number | null;
}

export class WavefrontObjLoader {

    public static async loadFile(filename: string, defaultColor = Color.RED): Promise<Mesh | null> {

        const data = await fetch(filename)
            .then(res => res.text())
            .then(data => data)
            .catch(ex => console.log(ex))

        if (!data) return null;

        const ret = new Mesh();

        const points: Array<Vec3D> = [new Vec3D(),];
        const faces: Array<Array<FacePoint>> = [];
        const vts: Array<Vec2D> = [new Vec2D(),];
        const normals: Array<Vec3D> = [new Vec3D(),];

        for (let line of data.split('\n')) {

            line = line.replace('\n', '');
            line = line.replace('\r', '');
            while (line.indexOf('  ') >= 0) line = line.replace('  ', ' ');
            
            const lineData = line.split(' ');

            if (lineData[0] == 'v') {

                points.push(new Vec3D(
                    parseFloat(lineData[1]),
                    parseFloat(lineData[2]),
                    parseFloat(lineData[3]),
                ));
            }

            if (lineData[0] == 'vt') {
                vts.push(new Vec2D(
                    parseFloat(lineData[1]),
                    parseFloat(lineData[2]),
                ));
            }

            if (lineData[0] == 'vn') {

                normals.push(new Vec3D(
                    parseFloat(lineData[1]),
                    parseFloat(lineData[2]),
                    parseFloat(lineData[3]),
                ));
            }

            if (lineData[0] == 'f') {

                let face = [];

                const mapF = (data: Array<string>) => {
                    return {
                        v: parseInt(data[0]),
                        vt: data[1] ? parseInt(data[1]) : null,
                        vn: data[2] ? parseInt(data[2]) : null
                    }
                };

                face.push(mapF(lineData[1].split('/')));
                face.push(mapF(lineData[2].split('/')));
                face.push(mapF(lineData[3].split('/')));
                if (lineData.length >= 5) face.push(mapF(lineData[4].split('/')));

                faces.push(face);
            }
        }

        for (let face of faces) {

            ret.triangles.push(new Triangle([
                points[face[0].v],
                points[face[1].v],
                points[face[2].v]
            ], [
                face[0].vt ? vts[face[0].vt] : new Vec2D(),
                face[1].vt ? vts[face[1].vt] : new Vec2D(),
                face[2].vt ? vts[face[2].vt] : new Vec2D(),
            ], defaultColor
            ));

            if (face.length == 4) {

                ret.triangles.push(new Triangle([
                    points[face[2].v],
                    points[face[3].v],
                    points[face[0].v]
                ], [
                    face[2].vt ? vts[face[2].vt] : new Vec2D(),
                    face[3].vt ? vts[face[3].vt] : new Vec2D(),
                    face[0].vt ? vts[face[0].vt] : new Vec2D(),
                ], defaultColor
                ))
            }
        }

        return ret;
    }
} 