import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

export default class ObjectDetector {
	private model: cocoSsd.ObjectDetection | null = null;
	private maxNumBoxes: number;
	private minScore: number;

	constructor() {
		this.model = null;
		this.maxNumBoxes = 20;
		this.minScore = 0.5;
	}

	setMaxNumBoxes(maxNumBoxes: number): void {
		if (maxNumBoxes <= 0) {
			console.error('max num boxes must be greater than 0');
		}
		this.maxNumBoxes = maxNumBoxes;
	}

	setMinScore(minScore: number): void {
		if (minScore <= 0 || minScore >= 1) {
			console.error('min score must be between 0 and 1');
			return;
		}
		this.minScore = minScore;
	}

	async loadModel(): Promise<void> {
		this.model = await cocoSsd.load();
	}

	async detectObjects(
		imageElement: HTMLImageElement
	): Promise<cocoSsd.DetectedObject[]> {
		if (!this.model) {
			console.error('Model not loaded');
			return [];
		}
		return this.model.detect(imageElement, this.maxNumBoxes, this.minScore);
	}
}