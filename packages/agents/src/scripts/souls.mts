console.log("Build some souls");

import { fstat, writeFileSync } from "fs";
import {
	Column,
	DataSource,
	Entity,
	PrimaryGeneratedColumn,
	createQueryBuilder,
} from "typeorm";
import SoulBuilder from "../soul-builder";

const AppDataSource = new DataSource({
	type: "postgres",
	host: process.env.DB_HOST || "localhost",
	port: Number.parseInt(process.env.DB_PORT || "5432"),
	username: process.env.DB_USER || "postgres",
	password: process.env.DB_PASSWORD || "postgres",
	database: process.env.DB_NAME || "mydb",
	entities: [],

	ssl: {
		rejectUnauthorized: false,
	},
	synchronize: false, // In production, set sync to false and use migrations
});

await AppDataSource.initialize()
	.then(async () => {
		console.log("Data Source has been initialized!");
	})
	.catch((error) =>
		console.error("Error during Data Source initialization:", error),
	);

const em = await AppDataSource.createEntityManager();

const authorHandles = ["VitalikButerin", "elonmusk"];

for (const authorHandle of authorHandles) {
	const results = await em.query(
		`SELECT * from tweets WHERE author_user_name = $1 limit 200`,
		[authorHandle],
	);

	const tweets = results.map((result: any) => {
		return result?.raw_json.text;
	});

	// console.log('Tweets:', tweets);

	const summaries = await SoulBuilder.summarizePersonality(tweets);
	const personality = await SoulBuilder.buildSoul(summaries);

	console.log("Soul:", personality);

	const metadata = {
		name: authorHandle,
		personality,
	};

	await writeFileSync(
		`../fixture/soul/${authorHandle}.txt`,
		JSON.stringify(metadata),
	);
}
