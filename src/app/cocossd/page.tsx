'use client';
import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import WebcamDetector from '../components/WebcamDetector';
import ObjectDetector from '@/utils/detectors/cocossdObjectDetection';
import { drawBoundingBox } from '@/utils/canvasUtils';
import useAnimationFrame from '@/hooks/useAnimationFrame';

const minScoreThresholds = [0.3, 0.5, 0.7, 0.9];

export default function Page() {
	const [detector, setDetector] = useState<ObjectDetector | null>(null);
	const [minScore, setMinScore] = useState(0.5);
	const webcamRef = useRef<Webcam>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Load the model
	useEffect(() => {
		const initDetector = async () => {
			const newDetector = new ObjectDetector();
			await newDetector.loadModel();
			setDetector(newDetector);
		};

		initDetector();
	}, []);

	const handleDetection = async () => {
		if (!webcamRef.current || !canvasRef.current) return;
		const imageSrc = webcamRef.current!.getScreenshot();
		if (detector && imageSrc) {
			const img = new Image();
			img.src = imageSrc;
			await new Promise((resolve) => {
				img.onload = resolve;
			});

			// get predictions from screenshot
			const predictions = await detector.detectObjects(img);

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
		handleDetection();
	});

	return (
		<>
			<p>CocoSSD Page</p>
			<WebcamDetector
				modelLoaded={detector !== null}
				webcamRef={webcamRef}
				canvasRef={canvasRef}
			/>
			{detector && (
				<div>
					<p>Set Min Score</p>
					<div className="grid grid-cols-5">
						{minScoreThresholds.map((t, index) => (
							<button
								key={index}
								className="rounded-md bg-blue-400 m-2 py-4 px-8 disabled:bg-gray-400"
								type="button"
								onClick={() => {
									setMinScore(t);
									detector?.setMinScore(t);
								}}
								disabled={minScore === t}
							>
								{t}
							</button>
						))}
					</div>
				</div>
			)}
		</>
	);
}
