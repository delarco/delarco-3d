import { Triangle } from "../core/Triangle";

export class CanvasUtils {

    public static clear(context: CanvasRenderingContext2D, color: string): void {

        context.fillStyle = color;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }

    public static drawTriangleLines(context: CanvasRenderingContext2D, triangle: Triangle, color?: string): void {

        context.strokeStyle = color ? color : triangle.color;
        context.beginPath();
        context.moveTo(triangle.p1.x, triangle.p1.y);
        context.lineTo(triangle.p2.x, triangle.p2.y);
        context.lineTo(triangle.p3.x, triangle.p3.y);
        context.lineTo(triangle.p1.x, triangle.p1.y);
        context.stroke();
        context.closePath();

    }

    public static drawTriangle(context: CanvasRenderingContext2D, triangle: Triangle, color?: string): void {

        context.fillStyle = color ? color : triangle.color;
        context.beginPath();
        context.moveTo(triangle.points[0].x, triangle.points[0].y);
        context.lineTo(triangle.points[1].x, triangle.points[1].y);
        context.lineTo(triangle.points[2].x, triangle.points[2].y);
        context.fill();
        context.closePath();

    }
}
