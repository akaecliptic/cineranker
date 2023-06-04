import { FC } from "react";
import Link from "next/link";

const UserNotFound: FC<{}> = () => {
	return (
		<>
			<main>
				<div
					style={{
						margin: "auto",
						display: "flex",
						flexDirection: "column",
						gap: ".5rem",
					}}>
					<span>Error 404: No such user</span>
					<button>
						<Link href='/'>Go Homepage</Link>
					</button>
				</div>
			</main>
		</>
	);
};

export default UserNotFound;
