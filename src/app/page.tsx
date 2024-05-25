'use client';
import Webcam from 'react-webcam';
import cv from '@techstark/opencv-js';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
	const [modelLoaded, setModelLoaded] = useState(false);

	const webcamRef = useRef(null);
	const inputRef = useRef(null);
	const outputRef = useRef(null);

	// Load the model
	useEffect(() => {}, []);

	// Object detection when model is loaded
	useEffect(() => {}, [modelLoaded]);

	if (!modelLoaded) return <div>Model loading...</div>;

	return (
		<>
			<main>
				<h1>NextJS Object Detection</h1>
				<Webcam
					ref={webcamRef}
					className="webcam"
					screenshotFormat="image/jpeg"
					mirrored
				/>
				<img ref={inputRef} alt="input" className="inputImage" />
				<canvas ref={outputRef} className="outputImage" />
			</main>
		</>
	);
}
