import { FC } from "react";

import Welcome from "components/icons/Welcome";
import Card from "components/index/Card";

import "styles/pages/index.scss";

const IndexPage: FC = () => {
	return (
		<main>
			<Welcome />
			<section className='cards'>
				<Card title='Collect' content='Collect movies in your lists' emoji='📋' />
				<Card title='Rank' content='Rank movies in your lists' emoji='👑' />
				<Card title='Share' content='Share your lists with others' emoji='🌐' />
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

export default IndexPage;
