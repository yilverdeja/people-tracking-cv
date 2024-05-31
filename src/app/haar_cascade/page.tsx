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

const minNeighborsThresholds = [2, 3, 4, 5];

export default function Home() {
	const [detector, setDetector] = useState<HaarCascadeDetector | null>(null);
	const [threshold, setThreshold] = useState(2);
	const webcamRef = useRef<Webcam>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

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
		handleDetection();
	});

	return (
		<main>
			<h1 className="text-3xl font-bold">People Tracker</h1>
			<h2 className="text-xl">
				Change the threshold to filter the detected objects
			</h2>
			<WebcamDetector
				modelLoaded={detector !== null}
				webcamRef={webcamRef}
				canvasRef={canvasRef}
			/>
			{detector && (
				<div>
					<p>Set Min Neighbors</p>
					<div className="grid grid-cols-5">
						{minNeighborsThresholds.map((t, index) => (
							<button
								key={index}
								className="rounded-md bg-blue-400 m-2 py-4 px-8 disabled:bg-gray-400"
								type="button"
								onClick={() => {
									setThreshold(t);
									detector?.setMinNeighbors(t);
								}}
								disabled={threshold === t}
							>
								{t}
							</button>
						))}
					</div>
				</div>
			)}
		</main>
	);
}
