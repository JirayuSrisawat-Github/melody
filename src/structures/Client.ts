import { LogLevel, SapphireClient } from "@sapphire/framework";
import { token } from "../config";
import { Lavalink } from "./Lavalink";

/**
 * The client class for Melody.
 *
 * @since 1.0.0
 */
export class Client extends SapphireClient {
	/**
	 * The Lavalink manager for the client.
	 */
	public readonly manager: Lavalink = new Lavalink(this);

	/**
	 * @param options The options for the client.
	 */
	public constructor() {
		super({
			/**
			 * The logger options for the client.
			 */
			logger: { level: LogLevel[process.env.NODE_ENV === "development" ? "Debug" : "Info"] },
			/**
			 * The intents for the client.
			 *
			 * @remarks
			 * We use the `GUILDS` and `GUILD_VOICE_STATES` intents because we need to listen to guild events
			 * and to access the voice states of users.
			 */
			intents: 129, // GUILDS, GUILD_VOICE_STATES
		});
	}

	/**
	 * Logs the client in using the provided token.
	 *
	 * @param t The token to use for logging in.
	 */
	public async start(t?: string): Promise<void> {
		try {
			this.logger.info("Logging in");
			await this.login(t ?? token);
			this.logger.info("Logged in");
		} catch (error: unknown) {
			this.logger.fatal(error);
			await this.destroy();
			process.exit(1);
		}
	}
}
