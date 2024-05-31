const Header = () => {
	return (
		<header className="">
			<div className="mb-6">
				<h1 className="text-3xl font-bold">People Tracker</h1>
				<h2 className="text-xl">
					Change the threshold to filter the detected objects
				</h2>
			</div>
			<div className="flex flex-col gap-4">
				<p>
					This model detects{' '}
					<span className="font-semibold underline">person</span>{' '}
					objects defined in the COCO dataset, which is a large-scale
					object detection, segmentation, and captioning dataset.
				</p>
				<p>
					The detected objects will appear in bounding boxes. Tune the
					minimum score to only show{' '}
					<span className="font-semibold">person</span> objects
					meeting a certain confidence value. A value of 5 means that
					a bounding box will appear if the model is at least 5%
					confident the object is a{' '}
					<span className="font-semibold">person</span>{' '}
				</p>
			</div>
		</header>
	);
};

export default Header;
