import { Triangle } from "../core/Triangle";
import { Vec2D } from "../core/Vect2D";
import { Vec3D } from "../core/Vect3D";

export class VectorUtils {

    public static dotProduct(v1: Vec3D, v2: Vec3D): number {

        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }

    public static vectorLength(v: Vec3D): number {

        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    }

    public static add(v1: Vec3D, v2: Vec3D): Vec3D {

        return new Vec3D(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }

    public static sub(v1: Vec3D, v2: Vec3D): Vec3D {

        return new Vec3D(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }

    public static mul(v1: Vec3D, k: number): Vec3D {

        return new Vec3D(v1.x * k, v1.y * k, v1.z * k);
    }

    public static div(v1: Vec3D, k: number): Vec3D {

        return new Vec3D(v1.x / k, v1.y / k, v1.z / k);
    }

    public static normalise(v: Vec3D): Vec3D {

        const len = VectorUtils.vectorLength(v);
        return new Vec3D(v.x / len, v.y / len, v.z / len);
    }

    public static crossProduct(v1: Vec3D, v2: Vec3D): Vec3D {

        return new Vec3D(
            v1.y * v2.z - v1.z * v2.y,
            v1.z * v2.x - v1.x * v2.z,
            v1.x * v2.y - v1.y * v2.x
        );
    }

    public static intersectPlane(plane_p: Vec3D, plane_n: Vec3D, lineStart: Vec3D, lineEnd: Vec3D, t: number): {v: Vec3D, t: number} {
	
		plane_n = VectorUtils.normalise(plane_n);
		let plane_d = -VectorUtils.dotProduct(plane_n, plane_p);
		let ad = VectorUtils.dotProduct(lineStart, plane_n);
		let bd = VectorUtils.dotProduct(lineEnd, plane_n);
		t = (-plane_d - ad) / (bd - ad);
		let lineStartToEnd = VectorUtils.sub(lineEnd, lineStart);
		let lineToIntersect = VectorUtils.mul(lineStartToEnd, t);
		return { v: VectorUtils.add(lineStart, lineToIntersect), t };
	}



    public static triangleClipAgainstPlane(plane_p: Vec3D, plane_n: Vec3D, in_tri: Triangle, out_tri1: Triangle, out_tri2: Triangle): number 	{
		// Make sure plane normal is indeed normal
		plane_n = VectorUtils.normalise(plane_n);

		// Return signed shortest distance from point to plane, plane normal must be normalised
        const dist = (p: Vec3D): number => {

            let n = VectorUtils.normalise(p);
			return (plane_n.x * p.x + plane_n.y * p.y + plane_n.z * p.z - VectorUtils.dotProduct(plane_n, plane_p));
        };

		// Create two temporary storage arrays to classify points either side of plane
		// If distance sign is positive, point lies on "inside" of plane
		let inside_points = [new Vec3D(), new Vec3D(), new Vec3D()];  let nInsidePointCount = 0;
		let outside_points = [new Vec3D(), new Vec3D(), new Vec3D()]; let nOutsidePointCount = 0;
		let inside_tex = [new Vec2D(), new Vec2D(), new Vec2D()]; let nInsideTexCount = 0;
		let outside_tex = [new Vec2D(), new Vec2D(), new Vec2D()]; let nOutsideTexCount = 0;

		// Get signed distance of each point in triangle to plane
		let d0 = dist(in_tri.p1);
		let d1 = dist(in_tri.p2);
		let d2 = dist(in_tri.p3);

		if (d0 >= 0) { 
            inside_points[nInsidePointCount++] = in_tri.p1;
            inside_tex[nInsideTexCount++] = in_tri.t1; }
		else {
			outside_points[nOutsidePointCount++] = in_tri.p1;
            outside_tex[nOutsideTexCount++] = in_tri.t1;
		}
		if (d1 >= 0) {
			inside_points[nInsidePointCount++] = in_tri.p2;
            inside_tex[nInsideTexCount++] = in_tri.t2;
		}
		else {
			outside_points[nOutsidePointCount++] = in_tri.p2;
            outside_tex[nOutsideTexCount++] = in_tri.t2;
		}
		if (d2 >= 0) {
			inside_points[nInsidePointCount++] = in_tri.p3;
            inside_tex[nInsideTexCount++] = in_tri.t3;
		}
		else {
			outside_points[nOutsidePointCount++] = in_tri.p3;
            outside_tex[nOutsideTexCount++] = in_tri.t3;
		}

		// Now classify triangle points, and break the input triangle into 
		// smaller output triangles if required. There are four possible
		// outcomes...

		if (nInsidePointCount == 0)
		{
			// All points lie on the outside of plane, so clip whole triangle
			// It ceases to exist

			return 0; // No returned triangles are valid
		}

		if (nInsidePointCount == 3)
		{
			// All points lie on the inside of plane, so do nothing
			// and allow the triangle to simply pass through
			for(let n = 0; n < 3; n++) {
				out_tri1.points[n].x = in_tri.points[n].x;
				out_tri1.points[n].y = in_tri.points[n].y;
				out_tri1.points[n].z = in_tri.points[n].z;
				out_tri1.points[n].w = in_tri.points[n].w;

				out_tri1.tex[n].u = in_tri.tex[n].u;
				out_tri1.tex[n].v = in_tri.tex[n].v;
				out_tri1.tex[n].w = in_tri.tex[n].w;

				out_tri1.color = in_tri.color;
			}

			return 1; // Just the one returned original triangle is valid
		}

		if (nInsidePointCount == 1 && nOutsidePointCount == 2)
		{
			// Triangle should be clipped. As two points lie outside
			// the plane, the triangle simply becomes a smaller triangle

			// Copy appearance info to new triangle
			out_tri1.color =  in_tri.color;
			//out_tri1.sym = in_tri.sym;

			// The inside point is valid, so keep that...
			out_tri1.points[0] = inside_points[0];
			out_tri1.tex[0] = inside_tex[0];

			// but the two new points are at the locations where the 
			// original sides of the triangle (lines) intersect with the plane
			let t = 0;
            
            const { v: retV, t: retT } = VectorUtils.intersectPlane(plane_p, plane_n, inside_points[0], outside_points[0], t);

            out_tri1.points[1] = retV; //VectorUtils.intersectPlane(plane_p, plane_n, inside_points[0], outside_points[0], t);
            t = retT;

			out_tri1.tex[1].u = t * (outside_tex[0].u - inside_tex[0].u) + inside_tex[0].u;
			out_tri1.tex[1].v = t * (outside_tex[0].v - inside_tex[0].v) + inside_tex[0].v;
			out_tri1.tex[1].w = t * (outside_tex[0].w - inside_tex[0].w) + inside_tex[0].w;

            const { v: retV2, t: retT2 } = VectorUtils.intersectPlane(plane_p, plane_n, inside_points[0], outside_points[1], t);

			out_tri1.points[2] = retV2;
            t = retT2;

			out_tri1.tex[2].u = t * (outside_tex[1].u - inside_tex[0].u) + inside_tex[0].u;
			out_tri1.tex[2].v = t * (outside_tex[1].v - inside_tex[0].v) + inside_tex[0].v;
			out_tri1.tex[2].w = t * (outside_tex[1].w - inside_tex[0].w) + inside_tex[0].w;

			return 1; // Return the newly formed single triangle
		}

		if (nInsidePointCount == 2 && nOutsidePointCount == 1)
		{
			// Triangle should be clipped. As two points lie inside the plane,
			// the clipped triangle becomes a "quad". Fortunately, we can
			// represent a quad with two new triangles

			// Copy appearance info to new triangles
			out_tri1.color =  in_tri.color;
			//out_tri1.sym = in_tri.sym;

			out_tri2.color =  in_tri.color;
			//out_tri2.sym = in_tri.sym;

			// The first triangle consists of the two inside points and a new
			// point determined by the location where one side of the triangle
			// intersects with the plane
			out_tri1.points[0] = inside_points[0];
			out_tri1.points[1] = inside_points[1];
			out_tri1.tex[0] = inside_tex[0];
			out_tri1.tex[1] = inside_tex[1];

			let t = 0;

            const {v: retV, t: retT } = VectorUtils.intersectPlane(plane_p, plane_n, inside_points[0], outside_points[0], t);

			out_tri1.points[2] = retV;
            t = retT;

			out_tri1.tex[2].u = t * (outside_tex[0].u - inside_tex[0].u) + inside_tex[0].u;
			out_tri1.tex[2].v = t * (outside_tex[0].v - inside_tex[0].v) + inside_tex[0].v;
			out_tri1.tex[2].w = t * (outside_tex[0].w - inside_tex[0].w) + inside_tex[0].w;

			// The second triangle is composed of one of he inside points, a
			// new point determined by the intersection of the other side of the 
			// triangle and the plane, and the newly created point above
			out_tri2.points[0] = inside_points[1];
			out_tri2.tex[0] = inside_tex[1];
			out_tri2.points[1] = out_tri1.points[2];
			out_tri2.tex[1] = out_tri1.tex[2];

            const {v: retV2, t: retT2 } = VectorUtils.intersectPlane(plane_p, plane_n, inside_points[1], outside_points[0], t);

			out_tri2.points[2] = retV2;
            t = retT2;

			out_tri2.tex[2].u = t * (outside_tex[0].u - inside_tex[1].u) + inside_tex[1].u;
			out_tri2.tex[2].v = t * (outside_tex[0].v - inside_tex[1].v) + inside_tex[1].v;
			out_tri2.tex[2].w = t * (outside_tex[0].w - inside_tex[1].w) + inside_tex[1].w;
			return 2; // Return two newly formed triangles which form a quad
		}

        console.log('should not reach here');
        return 0;
	}
}
