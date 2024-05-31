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

	// sets the width and height based on the webcam video size
	const updateVideoDimensions = () => {
		if (webcamRef.current && webcamRef.current.video) {
			const video = webcamRef.current.video;
			const aspectRatio = video.videoWidth / video.videoHeight;
			const container = containerRef.current;
			if (!container) return;

			let { width, height } = container.getBoundingClientRect();

			if (width / height > aspectRatio) {
				// landscape mode
				// Container is wider than needed, adjust width based on height
				width = height * aspectRatio;
			} else {
				// portrait mode
				// Container is taller than needed, adjust height based on width
				height = width / aspectRatio;
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
		const videoElement = webcamRef.current?.video;

		if (!videoElement) return;

		const handleLoadedMetadata = () => {
			updateVideoDimensions();
		};

		videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);

		// Call once immediately in case the video is already loaded
		// or the metadata loads before the event listener is set
		updateVideoDimensions();

		return () => {
			videoElement.removeEventListener(
				'loadedmetadata',
				handleLoadedMetadata
			);
		};
	}, [webcamRef.current]); // Dependency on the webcamRef itself

	if (modelLoaded)
		return (
			<div
				ref={containerRef}
				className="flex flex-col justify-start md:justify-center items-center w-full h-full mx-4 md:m-4"
			>
				<article
					className="relative"
					style={{
						width: dimensions.width
							? dimensions.width
							: containerRef.current?.offsetWidth,
						height: dimensions.height
							? dimensions.height
							: containerRef.current?.offsetHeight,
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
						width={
							dimensions.width
								? dimensions.width
								: containerRef.current?.offsetWidth
						}
						height={
							dimensions.height
								? dimensions.height
								: containerRef.current?.offsetHeight
						}
					/>
				</article>
				<div
					className="flex flex-col md:flex-row justify-between"
					style={{
						width: dimensions.width
							? dimensions.width
							: containerRef.current?.offsetWidth,
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
						<p className="order-2 md:order-1">{fps}</p>
						<p className="order-1 md:order-2 font-bold flex justify-center items-center">
							FPS<span className="block md:hidden">:</span>
						</p>
					</div>
				</div>
			</div>
		);
	else
		return (
			<div
				className="flex flex-col gap-2 justify-center items-center animate-pulse"
				style={{
					width: dimensions.width
						? dimensions.width
						: containerRef.current?.offsetWidth,
					height: dimensions.height
						? dimensions.height
						: containerRef.current?.offsetHeight,
				}}
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
