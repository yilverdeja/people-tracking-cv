'use client';

import { useEffect, useRef, useState } from 'react';
import WebcamDetector from '../components/WebcamDetector';
import Webcam from 'react-webcam';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

export default function Page() {
	const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
	const webcamRef = useRef<Webcam>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Load the model
	useEffect(() => {
		const loadModel = async () => {
			setModel(await cocoSsd.load());
		};

		loadModel();
	}, []);

	// Use Model
	useEffect(() => {
		if (!model) return;

		const detectObjects = async () => {
			const imageSrc = webcamRef.current!.getScreenshot();
			if (!imageSrc) return;

			const img = new Image();
			img.src = imageSrc;
			await new Promise((resolve) => {
				img.onload = resolve;
			});

			// get predictions from screenshot
			const predictions = await model.detect(img);

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
					context.strokeStyle = 'red';
					context.lineWidth = 2;
					const [x, y, width, height] = prediction.bbox;
					context.strokeRect(x, y, width, height);
				});
		};

		let handle: number;
		const nextTick = () => {
			handle = requestAnimationFrame(async () => {
				await detectObjects();
				nextTick();
			});
		};

		nextTick();
		return () => {
			cancelAnimationFrame(handle);
		};
	}, [model]);

	return (
		<>
			<p>CocoSSD Page</p>
			<WebcamDetector
				modelLoaded={model !== null}
				webcamRef={webcamRef}
				canvasRef={canvasRef}
			/>
		</>
	);
}
