import { LogLevel, SapphireClient } from "@sapphire/framework";
import { prefix, token } from "../config";
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
			 * We use the `GUILD_MESSAGES` and `MESSAGE_CONTENT` intents because we need to listen to message events.
			 */
			intents: 33409, // GUILDS, GUILD_VOICE_STATES, GUILD_MESSAGES, MESSAGE_CONTENT
			/**
			 * The default prefix for the client.
			 */
			defaultPrefix: prefix,
			/**
			 * Whether or not to load message command listeners when the client starts.
			 * This is set to `true` by default, so message command listeners will be loaded when the client starts.
			 */
			loadMessageCommandListeners: true,

			/**
			 * Whether or not to make command matching case-insensitive.
			 * This is set to `true` by default, so command matching will be case-insensitive.
			 */
			caseInsensitiveCommands: true,
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
