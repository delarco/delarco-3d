import { Color } from "../core/Color";
import { Mesh } from "../core/Mesh";
import { Triangle } from "../core/Triangle";
import { Vec2D } from "../core/Vect2D";
import { Vec3D } from "../core/Vect3D";

export class CubeGeometry extends Mesh {

    constructor(size: number = 1, color?: Color) {
        super();

        this.triangles = [

            // SOUTH
            new Triangle([
                new Vec3D(0, 0, 0),
                new Vec3D(0, size, 0),
                new Vec3D(size, size, 0)
            ], [
                new Vec2D(0.0, 1.0, 1.0),
                new Vec2D(0.0, 0.0, 1.0),
                new Vec2D(1.0, 0.0, 1.0),
            ], Color.GREEN),
            new Triangle([
                new Vec3D(0, 0, 0),
                new Vec3D(size, size, 0),
                new Vec3D(size, 0, 0)
            ], [
                new Vec2D(0.0, 1.0, 1.0),
                new Vec2D(1.0, 0.0, 1.0),
                new Vec2D(1.0, 1.0, 1.0),
            ], Color.GREEN),

            // EAST
            new Triangle([
                new Vec3D(size, 0, 0),
                new Vec3D(size, size, 0),
                new Vec3D(size, size, size)
            ], [
                new Vec2D(0.0, 1.0, 1.0),
                new Vec2D(0.0, 0.0, 1.0),
                new Vec2D(1.0, 0.0, 1.0),
            ], Color.BLUE),
            new Triangle([
                new Vec3D(size, 0, 0),
                new Vec3D(size, size, size),
                new Vec3D(size, 0, size)
            ], [
                new Vec2D(0.0, 1.0, 1.0),
                new Vec2D(1.0, 0.0, 1.0),
                new Vec2D(1.0, 1.0, 1.0),
            ], Color.BLUE),

            // NORTH
            new Triangle([
                new Vec3D(size, 0, size),
                new Vec3D(size, size, size),
                new Vec3D(0, size, size)
            ], [
                new Vec2D(0.0, 1.0, 1.0),
                new Vec2D(0.0, 0.0, 1.0),
                new Vec2D(1.0, 0.0, 1.0),
            ], Color.RED),
            new Triangle([
                new Vec3D(size, 0, size),
                new Vec3D(0, size, size),
                new Vec3D(0, 0, size)
            ], [
                new Vec2D(0.0, 1.0, 1.0),
                new Vec2D(1.0, 0.0, 1.0),
                new Vec2D(1.0, 1.0, 1.0),
            ], Color.RED),

            // WEST
            new Triangle([
                new Vec3D(0, 0, size),
                new Vec3D(0, size, size),
                new Vec3D(0, size, 0)
            ], [
                new Vec2D(0.0, 1.0, 1.0),
                new Vec2D(0.0, 0.0, 1.0),
                new Vec2D(1.0, 0.0, 1.0),
            ], Color.ORANGE),
            new Triangle([
                new Vec3D(0, 0, size),
                new Vec3D(0, size, 0),
                new Vec3D(0, 0, 0)
            ], [
                new Vec2D(0.0, 1.0, 1.0),
                new Vec2D(1.0, 0.0, 1.0),
                new Vec2D(1.0, 1.0, 1.0),
            ], Color.ORANGE),

            // TOP
            new Triangle([
                new Vec3D(0, size, 0),
                new Vec3D(0, size, size),
                new Vec3D(size, size, size)
            ], [
                new Vec2D(0.0, 1.0, 1.0),
                new Vec2D(0.0, 0.0, 1.0),
                new Vec2D(1.0, 0.0, 1.0),
            ], Color.YELLOW),
            new Triangle([
                new Vec3D(0, size, 0),
                new Vec3D(size, size, size),
                new Vec3D(size, size, 0)
            ], [
                new Vec2D(0.0, 1.0, 1.0),
                new Vec2D(1.0, 0.0, 1.0),
                new Vec2D(1.0, 1.0, 1.0),
            ], Color.YELLOW),

            // BOTTOM
            new Triangle([
                new Vec3D(size, 0, size),
                new Vec3D(0, 0, size),
                new Vec3D(0, 0, 0)
            ], [
                new Vec2D(0.0, 1.0, 1.0),
                new Vec2D(0.0, 0.0, 1.0),
                new Vec2D(1.0, 0.0, 1.0),
            ], Color.BLACK),
            new Triangle([
                new Vec3D(size, 0, size),
                new Vec3D(0, 0, 0),
                new Vec3D(size, 0, 0)
            ], [
                new Vec2D(0.0, 1.0, 1.0),
                new Vec2D(1.0, 0.0, 1.0),
                new Vec2D(1.0, 1.0, 1.0),
            ], Color.BLACK),
        ];

        if (color) for (let tri of this.triangles) tri.color = color;
    }
}
