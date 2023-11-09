import { FC } from "react";

import Welcome from "components/icons/Welcome";
import Card from "components/index/Card";

const Main: FC<{}> = () => {
	return (
		<main>
			<Welcome />
			<section className='cards'>
				<Card title='List' />
				<Card title='Rank' />
				<Card title='Share' />
			</section>
			<section className='mantra'>
				<h5>And remember</h5>
				<div>
					<h2>Don’t judge a book by it’s cover</h2>
					<h2>Always judge someone for their taste in movies</h2>
				</div>
			</section>
		</main>
	);
};

export default Main;
