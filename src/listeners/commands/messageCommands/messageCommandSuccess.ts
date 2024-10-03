import { MessageCommandSuccessPayload } from "@sapphire/framework";
import { Listener, LogLevel } from "@sapphire/framework";
import { Logger } from "@sapphire/plugin-logger";
import { logSuccessCommand } from "../../../lib/utils";

/**
 * The "messageCommandSuccess" event listener class.
 *
 * @since 1.0.0
 */
export class UserEvent extends Listener {
	/**
	 * Runs once the event is fired.
	 *
	 * @param payload - The payload of the event.
	 * @since 1.0.0
	 */
	public override run(payload: MessageCommandSuccessPayload): void {
		logSuccessCommand(payload);
	}

	/**
	 * Runs when the listener is being loaded, it enables the listener only if the logger is set to debug level
	 * @since 1.0.0
	 */
	public override onLoad(): unknown {
		this.enabled = (<Logger>this.container.logger).level <= LogLevel.Debug;
		return super.onLoad();
	}
}
