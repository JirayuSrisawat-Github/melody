import { Events, MessageCommandDeniedPayload } from "@sapphire/framework";
import { Listener, UserError } from "@sapphire/framework";

/**
 * The "messageCommandDenied" event listener class.
 *
 * @since 1.0.0
 */
export class UserEvent extends Listener<typeof Events.MessageCommandDenied> {
	/**
	 * Runs once the event is fired
	 *
	 * @param context The context that contains the user error
	 * @param message The message that contains the payload
	 * @since 1.0.0
	 */
	public override async run({ context, message: content }: UserError, { message }: MessageCommandDeniedPayload) {
		// If the error was marked as silent, do not reply
		if (Reflect.get(Object(context), "silent")) return;

		// Reply to the message with the user error
		return message.reply({ content, allowedMentions: { users: [message.author.id], roles: [] } });
	}
}

