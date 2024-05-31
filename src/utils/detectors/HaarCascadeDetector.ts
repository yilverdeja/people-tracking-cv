import cv from '@techstark/opencv-js';
import BaseDetector from './BaseDetector';
import { loadDataFile } from '../cvDataFile';

type Detection = { faces: cv.Rect[]; eyes: cv.Rect[][] };

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

export default class HaarCascadeDetector extends BaseDetector {
	private classifiersLoaded: boolean = false;
	private faceCascade: cv.CascadeClassifier;
	private eyeCascade: cv.CascadeClassifier;
	scaleFactor: number;
	minNeighbors: number;

	constructor() {
		super();
		this.faceCascade = new cv.CascadeClassifier();
		this.eyeCascade = new cv.CascadeClassifier();
		this.scaleFactor = 1.1;
		this.minNeighbors = 3;
	}

	async loadModel(): Promise<void> {
		// await this.loadHaarFaceModels();

		const faceLoaded = await this.faceCascade.load(
			'haarcascade_frontalface_default.xml'
		);
		const eyeLoaded = await this.eyeCascade.load('haarcascade_eye.xml');

		if (!faceLoaded || !eyeLoaded) {
			throw new Error('Failed to load classifiers.');
		}

		this.classifiersLoaded = true;
	}

	async detect(imageElement: HTMLImageElement): Promise<Detection> {
		if (!this.classifiersLoaded) {
			throw new Error('Models are not loaded');
		}

		// convert image to a Mat
		const img = cv.imread(imageElement);

		// create gray image
		const gray = new cv.Mat();
		cv.cvtColor(img, gray, cv.COLOR_RGBA2GRAY, 0);

		// start detection
		const faces = new cv.RectVector();
		const msize = new cv.Size(0, 0);
		this.faceCascade.detectMultiScale(
			gray,
			faces,
			this.scaleFactor,
			this.minNeighbors,
			0,
			msize,
			msize
		);

		const detections: Detection = {
			faces: [],
			eyes: [],
		};

		for (let i = 0; i < faces.size(); ++i) {
			const face = faces.get(i);
			detections.faces.push(face);

			// Detect eyes within face ROI
			const roiGray = gray.roi(face);
			const eyes = new cv.RectVector();
			this.eyeCascade.detectMultiScale(roiGray, eyes);
			const eyesArray = [];
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
		faces.delete();

		return detections;
	}

	setScaleFactor(scaleFactor: number): void {
		this.scaleFactor = scaleFactor;
	}

	setMinNeighbors(minNeighbors: number): void {
		this.minNeighbors = minNeighbors;
	}
}
