/* eslint-disable @next/next/no-img-element */
'use client';
import Webcam from 'react-webcam';
import cv from '@techstark/opencv-js';
import { useEffect, useRef, useState } from 'react';
import { FaceDetector, loadHaarFaceModels } from '@/haarFaceDetection';
import WebcamDetector from './components/WebcamDetector';

const size = {
	width: 640,
	height: 360,
};

const minNeighborsThresholds = [2, 3, 4, 5];

export default function Home() {
	const [detector, setDetector] = useState<FaceDetector | null>(null);
	const [threshold, setThreshold] = useState(2);
	const webcamRef = useRef<Webcam>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Load Model
	useEffect(() => {
		loadHaarFaceModels().then(() => {
			setDetector(new FaceDetector());
		});
	}, []);

	// Use Model
	useEffect(() => {
		if (!detector) return;

		const detectFace = async () => {
			const imageSrc = webcamRef.current!.getScreenshot();
			if (!imageSrc) return;

			const img = new Image();

			img.src = imageSrc;
			await new Promise((resolve) => {
				img.onload = resolve;
			});
			const imgMat = cv.imread(img);
			await detector.loadClassifiers();
			const detections = await detector.detectFaces(imgMat);

			const context = canvasRef.current!.getContext('2d')!;
			context.clearRect(
				0,
				0,
				canvasRef.current!.width,
				canvasRef.current!.height
			);

			detections.faces.forEach((face, index) => {
				context.strokeStyle = 'red';
				context.lineWidth = 2;
				context.strokeRect(face.x, face.y, face.width, face.height);

				const eyesInFace = detections.eyes[index];
				eyesInFace.forEach((eye) => {
					context.strokeStyle = 'blue';
					context.lineWidth = 1;
					context.strokeRect(eye.x, eye.y, eye.width, eye.height);
				});
			});

			imgMat.delete();
		};

		let handle: number;
		const nextTick = () => {
			handle = requestAnimationFrame(async () => {
				await detectFace();
				nextTick();
			});
		};

		nextTick();
		return () => {
			cancelAnimationFrame(handle);
		};
	}, [detector]);

	return (
		<main>
			<h1 className="text-3xl font-bold">People Tracker</h1>
			<h2 className="text-xl">
				Change the threshold to filter the detected objects
			</h2>
			<WebcamDetector webcamRef={webcamRef} canvasRef={canvasRef} />
			{detector && (
				<div>
					<p>Set thresholds</p>
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
			{!detector && <div>Loading Haar-cascade face model...</div>}
		</main>
	);
}
