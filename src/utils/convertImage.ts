/**
 * Converts a base64 image string into an image
 * @param imageSrc
 * @returns HTMLImageElement
 */
export async function convertBase64StringToImage(
	imageSrc: string
): Promise<HTMLImageElement> {
	const img = new Image();
	img.src = imageSrc;
	await new Promise((resolve) => {
		img.onload = resolve;
	});
	return img;
}
