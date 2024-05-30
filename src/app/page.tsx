/* eslint-disable @next/next/no-img-element */
'use client';
import Webcam from 'react-webcam';
import cv from '@techstark/opencv-js';
import { useEffect, useRef, useState } from 'react';
import { FaceDetector, loadHaarFaceModels } from '@/haarFaceDetection';

export default function Home() {
	const [detector, setDetector] = useState<FaceDetector | null>(null);
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
			detector.dispose();
		};
	}, [detector]);

	return (
		<main>
			<h1>NextJS Object Detection</h1>
			<div className="relative w-[640px] h-[360px]">
				<Webcam
					ref={webcamRef}
					className="absolute h-full w-full top-0 left-0"
					screenshotFormat="image/jpeg"
					videoConstraints={{
						width: 1280,
						height: 720,
						facingMode: 'user',
					}}
					mirrored
				/>
				<canvas
					ref={canvasRef}
					className="absolute h-full w-full top-0 left-0"
					width={640}
					height={360}
				/>
			</div>
			{!detector && <div>Loading Haar-cascade face model...</div>}
		</main>
	);
}
