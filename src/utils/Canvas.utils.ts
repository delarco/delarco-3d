import { Color } from "../core/Color";
import { Triangle } from "../core/Triangle";

export class CanvasUtils {

    public static clear(context: CanvasRenderingContext2D, color: Color): void {

        context.fillStyle = color.RGB;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }

    public static drawTriangleLines(context: CanvasRenderingContext2D, triangle: Triangle, color?: Color): void {

        context.strokeStyle = color?.RGB || triangle.color.RGB;
        context.beginPath();
        context.moveTo(triangle.p1.x, context.canvas.height - triangle.p1.y);
        context.lineTo(triangle.p2.x, context.canvas.height - triangle.p2.y);
        context.lineTo(triangle.p3.x, context.canvas.height - triangle.p3.y);
        context.lineTo(triangle.p1.x, context.canvas.height - triangle.p1.y);
        context.stroke();
        context.closePath();
    }

    public static drawTriangle(context: CanvasRenderingContext2D, triangle: Triangle, color?: Color): void {

        context.fillStyle = color?.RGB || triangle.color.RGB;
        context.beginPath();
        context.moveTo(triangle.p1.x, context.canvas.height - triangle.p1.y);
        context.lineTo(triangle.p2.x, context.canvas.height - triangle.p2.y);
        context.lineTo(triangle.p3.x, context.canvas.height - triangle.p3.y);
        context.fill();
        context.closePath();
    }
}
