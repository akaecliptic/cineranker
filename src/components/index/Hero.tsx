"use client";

import { FC, useEffect, useRef, useState } from "react";
import Image from "next/image";

import border from "images/index/border.svg";
import gradient from "images/index/gradient.svg";
import list from "images/index/list.png";
import rank from "images/index/rank.png";
import share from "images/index/share.png";

const Hero: FC<{}> = () => {
	const [active, setActive] = useState<number>(0);
	const buttonContainerRef = useRef<HTMLDivElement>(null);

	const updateSlide = (position: number): void => {
		if (position === active) return;
		if (position > 2 || position < 0) position = 0;

		const container: HTMLDivElement = document.getElementById("imageReel") as HTMLDivElement;
		const verticle = document.body.clientWidth <= 550;

		if (container === null) return;

		const scrollBy = calculateScroll(position, container, verticle);

		if (verticle) {
			container.scrollTop += position < active ? -scrollBy : scrollBy;
		} else {
			container.scrollLeft += position < active ? -scrollBy : scrollBy;
		}

		setActive(position);
	};

	const calculateScroll = (
		position: number,
		container: HTMLDivElement,
		verticle: boolean
	): number => {
		const middle: HTMLDivElement = document.getElementById("middleChild") as HTMLDivElement;

		if (middle === null) return 0;

		if (verticle) {
			return position !== 1
				? (container.scrollHeight / 3) * Math.abs(position - active)
				: middle.clientHeight;
		}

		return position !== 1
			? (container.scrollWidth / 3) * Math.abs(position - active)
			: middle.clientWidth;
	};

	useEffect(() => {
		if (buttonContainerRef.current === null) return;

		const buttons = buttonContainerRef.current.children;

		for (let i = 0; i < buttons.length; i++) {
			if (i === active) {
				buttons[i].classList.add("current");
				continue;
			}

			buttons[i].classList.remove("current");
		}
	}, [buttonContainerRef, active]);

	return (
		<section className='slideshow'>
			<div ref={buttonContainerRef} className='titles'>
				<button
					type='button'
					className='title-select'
					name='list'
					onClick={() => updateSlide(0)}>
					LIST
				</button>
				<button
					type='button'
					className='title-select'
					name='rank'
					onClick={() => updateSlide(1)}>
					RANK
				</button>
				<button
					type='button'
					className='title-select'
					name='share'
					onClick={() => updateSlide(2)}>
					SHARE
				</button>
			</div>
			<div className='container-reel'>
				<>
					<Image
						className='border'
						src={border}
						alt='border image'
						width={500}
						height={250}
					/>
					<Image
						className='border'
						src={gradient}
						alt='border image'
						width={500}
						height={250}
					/>
				</>
				<div id='imageReel'>
					<div className='images'>
						<Image src={list} alt='list image' width={225} height={225} />
					</div>
					<div className='images' id='middleChild'>
						<Image src={rank} alt='rank image' width={225} height={225} />
					</div>
					<div className='images'>
						<Image src={share} alt='share image' width={225} height={225} />
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
