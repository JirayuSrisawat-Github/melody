import { Listener, LogLevel, type ChatInputCommandSuccessPayload } from "@sapphire/framework";
import { logSuccessCommand } from "../../../lib/utils";
import { ClientEvents } from "discord.js";
import { Logger } from "@sapphire/plugin-logger";

/**
 * The "chatInputCommandSuccess" event listener class.
 *
 * @since 1.0.0
 */
export class UserListener extends Listener<keyof ClientEvents> {
	/**
	 * Runs once the event is fired.
	 *
	 * @param payload - The {@link ChatInputCommandSuccessPayload}
	 * @since 1.0.0
	 */
	public override run(payload: ChatInputCommandSuccessPayload): void {
		// Log the command success event
		logSuccessCommand(payload);
	}

	/**
	 * Runs when the listener is being loaded, it enables the listener only if the logger is set to debug level
	 * @since 1.0.0
	 */
	public override onLoad(): unknown {
		// Enable the listener only if the logger is set to debug level
		this.enabled = (<Logger>this.container.logger).level <= LogLevel.Debug;
		return super.onLoad();
	}
}
