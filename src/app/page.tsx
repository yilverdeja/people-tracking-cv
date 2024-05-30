/* eslint-disable @next/next/no-img-element */
'use client';
import Webcam from 'react-webcam';
import cv from '@techstark/opencv-js';
import { useEffect, useRef, useState } from 'react';
import { detectHaarFace, loadHaarFaceModels } from '@/haarFaceDetection';

export default function Home() {
	const [modelLoaded, setModelLoaded] = useState(false);
	const webcamRef = useRef<Webcam>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Load Model
	useEffect(() => {
		loadHaarFaceModels().then(() => {
			setModelLoaded(true);
		});
	}, []);

	// Use Model
	useEffect(() => {
		if (!modelLoaded) return;

		const detectFace = async () => {
			const imageSrc = webcamRef.current!.getScreenshot();
			if (!imageSrc) return;

			const img = new Image();

			img.src = imageSrc;
			await new Promise((resolve) => {
				img.onload = resolve;
			});
			const imgMat = cv.imread(img);
			const detections = await detectHaarFace(imgMat);

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
	}, [modelLoaded]);

	return (
		<main>
			<h1>NextJS Object Detection</h1>
			<div className="relative w-[640px] h-[360px]">
				<Webcam
					ref={webcamRef}
					className="absolute h-full w-full top-0 left-0 border-black border-2"
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
					className="absolute h-full w-full top-0 left-0 border-green-500 border-2"
					width={640}
					height={360}
				/>
			</div>
			{!modelLoaded && <div>Loading Haar-cascade face model...</div>}
		</main>
	);
}
