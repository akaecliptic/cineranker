import { FC } from "react";
import Image from "next/image";

// https://gist.github.com/chibicode/fe195d792270910226c928b69a468206 🙏
// https://github.com/twitter/twemoji/issues/580 ⌚

export type PropTwemoji = {
	emoji: string;
	size?: number;
};

const Twemoji: FC<PropTwemoji> = ({ emoji, size = 25 }) => {
	const codepoint = emoji.codePointAt(0)!.toString(16);

	return (
		<Image
			src={`https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/${codepoint}.svg`}
			alt={`SVG of ${emoji}`}
			width={size}
			height={size}
			className='emoji'
		/>
	);
};

export default Twemoji;
