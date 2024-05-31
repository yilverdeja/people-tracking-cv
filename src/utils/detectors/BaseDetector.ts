export default abstract class BaseDetector {
	abstract loadModel(): Promise<void>;
	abstract detect(imageElement: HTMLImageElement): Promise<any>;
}
