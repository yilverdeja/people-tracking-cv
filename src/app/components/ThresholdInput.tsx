interface Props {
	threshold: number;
	onChange: (threshold: number) => void;
}

const ThresholdInput = ({ threshold, onChange }: Props) => {
	return (
		<article>
			<label className="text-lg font-bold" htmlFor="threshold">
				Minimum Confidence Score (%)
			</label>
			<div className="flex flex-row gap-2">
				<input
					className="w-full my-2 py-2 px-4 rounded-md"
					type="number"
					name="threshold"
					id="threshold"
					min={1}
					max={99}
					step={1}
					value={threshold}
					onChange={(event) => onChange(parseInt(event.target.value))}
				/>
			</div>
		</article>
	);
};

export default ThresholdInput;
