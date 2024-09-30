import { Lavalink } from "../src/structures/Lavalink";

declare module "discord.js" {
	interface Client {
		manager: Lavalink;
	}
}
