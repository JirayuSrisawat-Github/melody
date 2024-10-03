import { ChatInputCommandDeniedPayload, Events } from "@sapphire/framework";
import { Listener, UserError } from "@sapphire/framework";
import { InteractionResponse, Message } from "discord.js";

/**
 * The "chatInputCommandDenied" event listener class.
 *
 * @since 1.0.0
 */
export class UserEvent extends Listener<typeof Events.ChatInputCommandDenied> {
	/**
	 * @param context - The context object from the {@link UserError} with type {@link ChatInputCommandDeniedPayload}
	 * @param payload - The {@link ChatInputCommandDeniedPayload}
	 * @returns A promise that resolves to `void`
	 *
	 * @since 1.0.0
	 */
	public override async run(
		{ context, message: content }: UserError,
		{ interaction }: ChatInputCommandDeniedPayload,
	): Promise<Message<boolean> | InteractionResponse<boolean> | void> {
		// If the error was marked as silent, do not reply
		if (Reflect.get(Object(context), "silent")) return;

		// If the interaction was deferred or replied, edit the reply
		if (interaction.deferred || interaction.replied) {
			return interaction.editReply({
				content,
				// Only mention the user who triggered the command
				allowedMentions: { users: [interaction.user.id], roles: [] },
			});
		}

		// Otherwise, reply with an ephemeral message
		return interaction.reply({
			content,
			// Only mention the user who triggered the command
			allowedMentions: { users: [interaction.user.id], roles: [] },
			ephemeral: true,
		});
	}
}
