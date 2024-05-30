'use client';
import Webcam from 'react-webcam';
import React from 'react';

const size = {
	width: 640,
	height: 360,
};

interface Props {
	webcamRef: React.RefObject<Webcam>;
	canvasRef: React.RefObject<HTMLCanvasElement>;
}

const WebcamDetector = ({ webcamRef, canvasRef }: Props) => {
	return (
		<div
			className="relative"
			style={{ width: size.width, height: size.height }}
		>
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
				width={size.width}
				height={size.height}
			/>
		</div>
	);
};

export default WebcamDetector;
