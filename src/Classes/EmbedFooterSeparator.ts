import { createCanvas, Canvas, CanvasRenderingContext2D } from "canvas";

export class EmbedFooterSeparator {
	private canvas: Canvas;
	private context: CanvasRenderingContext2D;
	private readonly width: number;
	private readonly height: number;
	private readonly color: string;

	constructor(width: number, height: number, color: number) {
		this.width = width;
		this.height = height;
		this.color = `#${color.toString(16)}`;
		this.canvas = createCanvas(this.width, this.height);
		this.context = this.canvas.getContext("2d");
	}

	public generateImage(): Buffer {
		this.context.fillStyle = this.color;
		this.context.fillRect(0, 0, this.width, this.height);

		return this.canvas.toBuffer();
	}
}
