import { Fragment } from 'react';

const techStack = [
	{ name: 'NextJS', url: 'https://nextjs.org/' },
	{ name: 'ReactJS', url: 'https://react.dev/' },
	{ name: 'TensorFlowJS', url: 'https://github.com/tensorflow/tfjs' },
	{
		name: 'OpenCVJS',
		url: 'https://docs.opencv.org/4.x/d0/d84/tutorial_js_usage.html',
	},
];

const Footer = () => {
	return (
		<p className="text-sm">
			Built with{' '}
			{techStack.map((tech, index) => (
				<Fragment key={index}>
					<a
						className="hover:underline"
						href={tech.url}
						target="_blank"
					>
						{tech.name}
					</a>
					{index < techStack.length - 2
						? ', '
						: index === techStack.length - 2
						? ' & '
						: ''}
				</Fragment>
			))}
		</p>
	);
};

export default Footer;
