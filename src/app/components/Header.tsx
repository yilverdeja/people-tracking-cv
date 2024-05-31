const Header = () => {
	return (
		<header className="">
			<div className="mb-4 md:mb-6">
				<h1 className="text-xl md:text-3xl font-bold">
					People Tracker
				</h1>
				<h2 className="text-lg md:text-xl">
					Change the threshold to filter the detected objects
				</h2>
			</div>
			<div className="hidden md:flex flex-col gap-4">
				<p>
					This model detects{' '}
					<span className="font-semibold underline">person</span>{' '}
					objects defined in the COCO dataset, which is a large-scale
					object detection, segmentation, and captioning dataset.
				</p>
			</div>
		</header>
	);
};

export default Header;
