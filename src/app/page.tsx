/* eslint-disable @next/next/no-img-element */
'use client';
import Webcam from 'react-webcam';
import cv from '@techstark/opencv-js';
import { useEffect, useRef, useState } from 'react';
import { detectHaarFace, loadHaarFaceModels } from '@/haarFaceDetection';

export default function Home() {
	const [modelLoaded, setModelLoaded] = useState(false);
	const webcamRef = useRef<Webcam>(null);
	const imgRef = useRef<HTMLImageElement>(null);
	const faceImgRef = useRef<HTMLCanvasElement>(null);

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
			console.log('detect face');
			if (!imageSrc) return;

			return new Promise<void>((resolve) => {
				imgRef.current!.src = imageSrc;
				imgRef.current!.onload = async () => {
					try {
						const img = cv.imread(imgRef.current!);
						const newImg = await detectHaarFace(img);
						cv.imshow(faceImgRef.current!, newImg);
						img.delete();
						resolve();
					} catch (error) {
						console.error(error);
						resolve();
					}
				};
			});
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
			<Webcam
				ref={webcamRef}
				className="webcam"
				screenshotFormat="image/jpeg"
				mirrored
			/>
			<img ref={imgRef} className="hidden" alt="input" />
			<canvas ref={faceImgRef} className="outputImage" />
			{!modelLoaded && <div>Loading Haar-cascade face model...</div>}
		</main>
	);
}
