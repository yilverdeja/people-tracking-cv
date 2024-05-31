/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import Webcam from 'react-webcam';
import React, { useEffect, useState } from 'react';

interface Props {
	modelLoaded: boolean;
	webcamRef: React.RefObject<Webcam>;
	canvasRef: React.RefObject<HTMLCanvasElement>;
	width?: number;
	height?: number;
}

const WebcamDetector = ({ modelLoaded, webcamRef, canvasRef }: Props) => {
	const [dimensions, setDimensions] = useState({ width: 640, height: 360 });

	// sets the width and height based on the webcam video size
	const updateVideoDimensions = () => {
		if (webcamRef.current && webcamRef.current.video) {
			const video = webcamRef.current.video;
			const aspectRatio = video.videoWidth / video.videoHeight;
			let width, height;

			if (aspectRatio > 1) {
				// Landscape orientation
				width = Math.min(640, window.innerWidth);
				height = width / aspectRatio;
			} else {
				// Portrait orientation
				height = Math.min(360, window.innerHeight);
				width = height * aspectRatio;
			}

			setDimensions({ width, height });
		}
	};

	// add event listeners for resizing
	useEffect(() => {
		window.addEventListener('resize', updateVideoDimensions);
		return () =>
			window.removeEventListener('resize', updateVideoDimensions);
	}, []);

	// updates the dimensions when the video is loaded
	useEffect(() => {
		if (webcamRef.current) {
			webcamRef.current.video?.addEventListener(
				'loadedmetadata',
				updateVideoDimensions
			);
		}
	}, [webcamRef]);

	if (modelLoaded)
		return (
			<div
				className="relative"
				style={{ width: dimensions.width, height: dimensions.height }}
			>
				<Webcam
					ref={webcamRef}
					className="absolute h-full w-full top-0 left-0 border-2 border-black-400"
					screenshotFormat="image/jpeg"
					videoConstraints={{
						width: { ideal: 1280 },
						height: { ideal: 720 },
						facingMode: 'user',
					}}
					mirrored
				/>
				<canvas
					ref={canvasRef}
					className="absolute h-full w-full top-0 left-0 border-2 border-green-400"
					width={dimensions.width}
					height={dimensions.height}
				/>
			</div>
		);
	else
		return (
			<div
				className="flex flex-col gap-2 justify-center items-center animate-pulse"
				style={{ width: dimensions.width, height: dimensions.height }}
			>
				<svg
					className="animate-spin"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M21 12a9 9 0 1 1-6.219-8.56" />
				</svg>
				<p className="animate-pulse">Loading model...</p>
			</div>
		);
};

export default WebcamDetector;
