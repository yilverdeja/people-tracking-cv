import cv from '@techstark/opencv-js';
import { loadDataFile } from './cvDataFile';

export async function loadHaarFaceModels() {
	try {
		console.log('=======start downloading Haar-cascade models=======');
		await loadDataFile(
			'haarcascade_frontalface_default.xml',
			'models/haarcascade_frontalface_default.xml'
		);
		await loadDataFile('haarcascade_eye.xml', 'models/haarcascade_eye.xml');
		console.log('=======downloaded Haar-cascade models=======');
	} catch (error) {
		console.error(error);
	}
}

/**
 * Detect faces and eyes from the input image and return their coordinates.
 * See https://docs.opencv.org/master/d2/d99/tutorial_js_face_detection.html
 * @param {cv.Mat} img Input image
 * @returns {Object} An object containing arrays of face and eye coordinates.
 */
export async function detectHaarFace(img: cv.Mat) {
	const gray = new cv.Mat();
	cv.cvtColor(img, gray, cv.COLOR_RGBA2GRAY, 0);

	const faces = new cv.RectVector();
	const faceCascade = new cv.CascadeClassifier();
	const eyeCascade = new cv.CascadeClassifier();
	// Load pre-trained classifiers
	faceCascade.load('haarcascade_frontalface_default.xml');
	eyeCascade.load('haarcascade_eye.xml');

	// Detect faces
	const msize = new cv.Size(0, 0);
	faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);

	const detections: {
		faces: { x: number; y: number; width: number; height: number }[];
		eyes: { x: number; y: number; width: number; height: number }[][];
	} = {
		faces: [],
		eyes: [],
	};

	for (let i = 0; i < faces.size(); ++i) {
		const face = faces.get(i);
		detections.faces.push({
			x: face.x,
			y: face.y,
			width: face.width,
			height: face.height,
		});

		// Detect eyes within face ROI
		const roiGray = gray.roi(face);
		const eyes = new cv.RectVector();
		eyeCascade.detectMultiScale(roiGray, eyes);
		let eyesArray: {
			x: number;
			y: number;
			width: number;
			height: number;
		}[] = [];
		for (let j = 0; j < eyes.size(); ++j) {
			const eye = eyes.get(j);
			eyesArray.push({
				x: eye.x + face.x, // Adjust coordinates relative to the full image
				y: eye.y + face.y,
				width: eye.width,
				height: eye.height,
			});
		}
		detections.eyes.push(eyesArray);
		roiGray.delete();
		eyes.delete();
	}

	gray.delete();
	faceCascade.delete();
	eyeCascade.delete();
	faces.delete();

	return detections;
}