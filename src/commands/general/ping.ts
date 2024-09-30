import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";
import { InteractionResponse } from "discord.js";

/**
 * A command that pings the bot and returns the latency.
 *
 * @since 1.0.0
 */
@ApplyOptions<Command.Options>({
	description: "Ping pong!", // The description of the command.
})
export class UserCommand extends Command {
	/**
	 * Registers the command to the registry.
	 *
	 * @param registry The registry to register the command to.
	 * @since 1.0.0
	 */
	public override registerApplicationCommands(registry: Command.Registry): void {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description,
		});
	}

	/**
	 * Runs the command when it is invoked.
	 *
	 * @param interaction The interaction that invoked the command.
	 * @returns The response to send to the user.
	 * @since 1.0.0
	 */
	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<InteractionResponse<boolean>> {
		const content = `Pong! ${Math.round(this.container.client.ws.ping)}ms`; // The content of the response.

		return interaction.reply({ content });
	}
}
