/* eslint-disable react/no-unescaped-entities */
'use client';
import { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import WebcamDetector from './components/WebcamDetector';
import Footer from './components/Footer';
import ThresholdInput from './components/ThresholdInput';
import Header from './components/Header';

export default function Home() {
	const [threshold, setThreshold] = useState(50);
	const [framesPerSecond, setFramesPerSecond] = useState(60);
	const webcamRef = useRef<Webcam>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const handleThresholdChange = (newThreshold: number) => {
		setThreshold(newThreshold);
	};

	return (
		<main className="grid grid-cols-3 gap-4 h-screen">
			<section className="col-span-2 flex justify-center items-center gap-4 h-screen">
				<WebcamDetector
					modelLoaded={true}
					webcamRef={webcamRef}
					canvasRef={canvasRef}
					threshold={threshold}
					fps={framesPerSecond}
				/>
			</section>

			<section className="flex flex-col justify-between col-span-1 bg-gray-200 p-8 h-screen overflow-scroll">
				<div className="flex flex-col gap-4">
					<Header />
					<ThresholdInput
						min={1}
						max={10}
						name="Threshold"
						threshold={threshold}
						onChange={handleThresholdChange}
					/>
				</div>

				<Footer />
			</section>
		</main>
	);
}
