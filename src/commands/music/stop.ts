import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";
import { Player } from "sakulink";

/**
 * The `stop` command.
 *
 * @since 1.0.0
 */
@ApplyOptions<Command.Options>({
	// The description of the command.
	description: "Stop playing music.",
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
	 * @since 1.0.0
	 */
	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		// Get the player for the guild
		const player: Player | undefined = this.container.client.manager.get(interaction.guildId!);
		if (!player) {
			// If the player is not found, return an error message
			return await interaction.reply({
				embeds: [
					{
						color: 0xff0000,
						description: "No music is being played.",
					},
				],
			});
		}

		// Stop the player
		player.destroy();

		// Reply with a success message
		await interaction.reply({
			embeds: [
				{
					color: 0xeab676,
					description: "Stopped playing music.",
				},
			],
		});
	}
}

