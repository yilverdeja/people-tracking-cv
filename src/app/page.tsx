'use client';

import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import useAnimationFrame from '@/hooks/useAnimationFrame';
import { drawBoundingBox } from '@/utils/canvasUtils';
import { convertBase64StringToImage } from '@/utils/convertImage';
import CocoSSDDetector from '@/utils/detectors/CocoSSDDetector';
import Footer from './components/Footer';
import Header from './components/Header';
import ThresholdInput from './components/ThresholdInput';
import WebcamDetector from './components/WebcamDetector';

export default function Page() {
	const [threshold, setThreshold] = useState(50);
	const [framesPerSecond, setFramesPerSecond] = useState(0);
	const animationFrameCount = useRef(0);
	const lastTime = useRef(Date.now());
	const [detector, setDetector] = useState<CocoSSDDetector | null>(null);
	const webcamRef = useRef<Webcam>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const handleThresholdChange = (newThreshold: number) => {
		if (detector) detector.setMinScore(newThreshold / 100);
		setThreshold(newThreshold);
	};

	// Load the model
	useEffect(() => {
		const initDetector = async () => {
			const newDetector = new CocoSSDDetector();
			await newDetector.loadModel();
			setDetector(newDetector);
		};

		initDetector();
	}, []);

	const handleDetection = async () => {
		if (!webcamRef.current || !canvasRef.current) return;
		const imageSrc = webcamRef.current!.getScreenshot();
		if (detector && imageSrc) {
			const img = await convertBase64StringToImage(imageSrc);

			// get predictions from screenshot
			const predictions = await detector.detect(img);

			// clear canvas
			const context = canvasRef.current!.getContext('2d')!;
			context.clearRect(
				0,
				0,
				canvasRef.current!.width,
				canvasRef.current!.height
			);

			// draw on canvas
			predictions
				.filter((prediction) => prediction.class === 'person')
				.forEach((prediction) => {
					const [x, y, width, height] = prediction.bbox;
					drawBoundingBox(context, x, y, width, height, 'red', 2);
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
					threshold={
						detector
							? Math.round(detector.minScore * 100)
							: threshold
					}
					fps={framesPerSecond}
				/>
			</section>

			<section className="flex flex-col justify-between col-span-1 bg-gray-200 p-8 h-screen overflow-scroll">
				<div className="flex flex-col gap-4">
					<Header />
					<ThresholdInput
						min={1}
						max={99}
						name="Minimum Confidence Score"
						unit="%"
						threshold={threshold}
						onChange={handleThresholdChange}
					/>
				</div>
				<Footer />
			</section>
		</main>
	);
}
