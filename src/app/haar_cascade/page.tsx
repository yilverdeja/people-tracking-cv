'use client';
import Webcam from 'react-webcam';
import { useEffect, useRef, useState } from 'react';
import WebcamDetector from '../components/WebcamDetector';
import { drawBoundingBox } from '@/utils/canvasUtils';
import useAnimationFrame from '@/hooks/useAnimationFrame';
import HaarCascadeDetector, {
	loadHaarFaceModels,
} from '@/utils/detectors/HaarCascadeDetector';
import { convertBase64StringToImage } from '@/utils/convertImage';
import Header from '../components/Header';
import ThresholdInput from '../components/ThresholdInput';
import Footer from '../components/Footer';

export default function Home() {
	const [detector, setDetector] = useState<HaarCascadeDetector | null>(null);
	const [threshold, setThreshold] = useState(3);
	const [framesPerSecond, setFramesPerSecond] = useState(0);
	const animationFrameCount = useRef(0);
	const lastTime = useRef(Date.now());
	const webcamRef = useRef<Webcam>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const handleThresholdChange = (newThreshold: number) => {
		if (detector) detector.setMinNeighbors(newThreshold);
		setThreshold(newThreshold);
	};

	// Load Model
	useEffect(() => {
		loadHaarFaceModels().then(() => {
			setDetector(new HaarCascadeDetector());
		});
	}, []);

	// Use Model
	const handleDetection = async () => {
		if (!webcamRef.current || !canvasRef.current) return;
		const imageSrc = webcamRef.current!.getScreenshot();
		if (detector && imageSrc) {
			await detector.loadModel(); // QUESTION: do I need to load a model everytime?
			const img = await convertBase64StringToImage(imageSrc);
			const detections = await detector.detect(img);

			const context = canvasRef.current!.getContext('2d')!;
			context.clearRect(
				0,
				0,
				canvasRef.current!.width,
				canvasRef.current!.height
			);

			detections.faces.forEach((face, index) => {
				drawBoundingBox(
					context,
					face.x,
					face.y,
					face.width,
					face.height,
					'red',
					2
				);

				const eyesInFace = detections.eyes[index];
				eyesInFace.forEach((eye) => {
					drawBoundingBox(
						context,
						eye.x,
						eye.y,
						eye.width,
						eye.height,
						'blue',
						2
					);
				});
			});
		}
	};

	useAnimationFrame(() => {
		const now = Date.now();
		const elapsed = now - lastTime.current;
		if (elapsed >= 1000) {
			// If more than a second has passed
			setFramesPerSecond(animationFrameCount.current); // Set the FPS based on the number of frames counted
			animationFrameCount.current = 0; // Reset frame count for the next second
			lastTime.current = now; // Reset the timer
		}

		animationFrameCount.current++;

		handleDetection();
	});

	return (
		<main className="grid grid-cols-3 gap-4 h-screen">
			<section className="col-span-2 flex justify-center items-center gap-4 h-screen">
				<WebcamDetector
					modelLoaded={detector !== null}
					webcamRef={webcamRef}
					canvasRef={canvasRef}
					threshold={detector ? detector.minNeighbors : threshold}
					fps={framesPerSecond}
				/>
			</section>

			<section className="flex flex-col justify-between col-span-1 bg-gray-200 p-8 h-screen overflow-scroll">
				<div className="flex flex-col gap-4">
					<Header />
					<ThresholdInput
						min={1}
						max={10}
						name="Minimum Neighbors"
						threshold={threshold}
						onChange={handleThresholdChange}
					/>
				</div>
				<Footer />
			</section>
		</main>
	);
}
