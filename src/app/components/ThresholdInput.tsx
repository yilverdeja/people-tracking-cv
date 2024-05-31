interface Props {
	threshold: number;
	min: number;
	max: number;
	name: string;
	unit?: string;
	onChange: (threshold: number) => void;
}

const ThresholdInput = ({
	min,
	max,
	name,
	unit = undefined,
	threshold,
	onChange,
}: Props) => {
	return (
		<article>
			<label className="text-md md:text-lg font-bold" htmlFor="threshold">
				{name} {unit && <span>({unit})</span>}
			</label>
			<div className="flex flex-row gap-2">
				<input
					className="w-full my-2 py-2 px-4 rounded-md"
					type="number"
					name="threshold"
					id="threshold"
					min={min}
					max={max}
					step={1}
					value={threshold}
					onChange={(event) => onChange(parseInt(event.target.value))}
				/>
			</div>
		</article>
	);
};

export default ThresholdInput;
