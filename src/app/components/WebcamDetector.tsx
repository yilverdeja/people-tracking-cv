/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import Webcam from 'react-webcam';
import React, { useEffect, useRef, useState } from 'react';

interface Props {
	modelLoaded: boolean;
	webcamRef: React.RefObject<Webcam>;
	canvasRef: React.RefObject<HTMLCanvasElement>;
	threshold: number;
	fps: number;
}

const WebcamDetector = ({
	modelLoaded,
	webcamRef,
	canvasRef,
	threshold,
	fps,
}: Props) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [dimensions, setDimensions] = useState({ width: 640, height: 360 });
	// const [maxDimensions, setMaxDimensions] = useState({
	// 	width: window.innerWidth,
	// 	height: window.innerHeight,
	// });

	// useEffect(() => {
	// 	if (containerRef.current) {
	// 		setMaxDimensions({
	// 			width: containerRef.current.offsetWidth,
	// 			height: containerRef.current.offsetHeight,
	// 		});
	// 	}
	// }, [containerRef]);

	// sets the width and height based on the webcam video size
	const updateVideoDimensions = () => {
		if (webcamRef.current && webcamRef.current.video) {
			const video = webcamRef.current.video;
			const aspectRatio = video.videoWidth / video.videoHeight;

			const maximumWidth = containerRef.current
				? containerRef.current.offsetWidth
				: window.innerWidth;
			const maximumHeight = containerRef.current
				? containerRef.current.offsetHeight
				: window.innerHeight;

			let width, height;

			if (aspectRatio > 1) {
				// Landscape orientation
				width = Math.min(640, maximumWidth);
				height = width / aspectRatio;
			} else {
				// Portrait orientation
				height = Math.min(360, maximumHeight);
				width = height * aspectRatio;
			}

			console.log(width, height);
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
				ref={containerRef}
				className="flex flex-col justify-center items-center w-full h-full m-4"
			>
				<article
					className="relative"
					style={{
						width: dimensions.width,
						height: dimensions.height,
					}}
				>
					<Webcam
						ref={webcamRef}
						className="absolute h-full w-full top-0 left-0"
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
						className="absolute h-full w-full top-0 left-0"
						width={dimensions.width}
						height={dimensions.height}
					/>
				</article>
				<div
					className="flex flex-row justify-between"
					style={{
						width: dimensions.width,
					}}
				>
					<div className="flex flex-row gap-2">
						<p className="font-bold">Minimum Confidence Score:</p>
						<p>
							{threshold}
							<span>%</span>
						</p>
					</div>
					<div className="flex flex-row gap-2">
						<p>{fps}</p>
						<p className="font-bold">FPS</p>
					</div>
				</div>
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
