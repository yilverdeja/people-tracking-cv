'use client';
import Webcam from 'react-webcam';
import React, { useRef } from 'react';

interface Props {
	modelLoaded: boolean;
	webcamRef: React.RefObject<Webcam>;
	canvasRef: React.RefObject<HTMLCanvasElement>;
	width?: number;
	height?: number;
}

const WebcamDetector = ({
	modelLoaded,
	webcamRef,
	canvasRef,
	width = 640,
	height = 360,
}: Props) => {
	const loadingCanvasRef = useRef(null);

	if (modelLoaded)
		return (
			<div className="relative" style={{ width, height }}>
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
					width={width}
					height={height}
				/>
			</div>
		);
	else
		return (
			<div
				className="flex flex-col gap-2 justify-center items-center animate-pulse"
				style={{ width, height }}
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
