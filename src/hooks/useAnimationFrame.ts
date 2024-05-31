/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect } from 'react';

type AnimationFrameCallback = () => void;

function useAnimationFrame(callback: AnimationFrameCallback) {
	const callbackRef = useRef<AnimationFrameCallback>(callback);
	const requestRef = useRef<number>(); // Persistent without re-rendering. We don't want the page to re-render everytime a new frame is requested.

	const animate = () => {
		callbackRef.current();
		requestRef.current = requestAnimationFrame(animate);
	};

	useEffect(() => {
		callbackRef.current = callback; // Update the callback if it changes
	}, [callback]);

	// Run once
	useEffect(() => {
		requestRef.current = requestAnimationFrame(animate);
		return () => {
			if (requestRef.current) {
				cancelAnimationFrame(requestRef.current);
			}
		};
	}, []);
}

export default useAnimationFrame;
