export function drawBoundingBox(
	context: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	color: string = 'red',
	lineWidth: number = 2
) {
	context.strokeStyle = color;
	context.lineWidth = lineWidth;
	context.strokeRect(x, y, width, height);
}
