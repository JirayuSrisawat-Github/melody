import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";
import { GuildMember } from "discord.js";
import { Player } from "sakulink";

/**
 * The `skip` command.
 *
 * @since 1.0.0
 */
@ApplyOptions<Command.Options>({
	// The description of the command.
	description: "Skips the current song.",
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
		// Check if the user is in a voice channel
		if (!(<GuildMember>interaction.member).voice.channel) {
			// If the user is not in a voice channel, return an error message
			return await interaction.reply({
				embeds: [
					{
						color: 0xff0000,
						description: "You are not in a voice channel.",
					},
				],
			});
		}

		// Check if the user is in the same voice channel as the bot
		if (interaction.guild!.members.me!.voice.channel && ((<GuildMember>interaction.member).voice.channel!.id !== interaction.guild!.members.me!.voice.channelId)) {
			// If the user is not in the same voice channel as the bot, return an error message
			return await interaction.reply({
				embeds: [
					{
						color: 0xff0000,
						description: "You are not in the same voice channel as me.",
					},
				],
			});
		}

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

		// Stop the player to play next track
		player.stop();

		// Reply with a success message
		await interaction.reply({
			embeds: [
				{
					color: 0xeab676,
					description: "Skipped current song.",
				},
			],
		});
	}
}

