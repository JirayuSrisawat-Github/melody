import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";
import { RandomLoadingMessage } from "../../lib/constants";
import { pickRandom } from "../../lib/utils";
import { Node } from "sakulink";
import { stripIndent } from "common-tags";
import { Message } from "discord.js";
import ms from "ms";

/**
 * The `node` command for Melody.
 *
 * @since 1.0.0
 */
@ApplyOptions<Command.Options>({
	description: "Display nodes information",
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
	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<Message<boolean>> {
		await interaction.reply({ content: pickRandom(RandomLoadingMessage) });

		// Get the list of nodes from the manager
		const nodes = this.container.client.manager.nodes.map((node: Node) => ({
			stats: node.stats,
			connected: node.connected,
			identifier: node.options.identifier,
		}));

		// Create an emoji for each node based on whether it is online or not
		const getEmoji = (isOnline: boolean) => (isOnline ? ":green_circle:" : ":red_circle:");

		// Create an embed with all the information
		const embed = {
			author: {
				name: this.container.client.user!.username,
				icon_url: this.container.client.user!.displayAvatarURL(),
			},
			color: 0xffffff,
			description: `${this.container.client.user!.username} Nodes Information`,
			fields: nodes.map((item) => ({
				inline: true,
				name: `${getEmoji(item.connected)} ${item.identifier}`,
				value: stripIndent`
        ┊ Connected: \`${item.stats.players}\`
        ┊ Playing: \`${item.stats.playingPlayers}\`
        ┊ CPU: \`${(item.stats.cpu.lavalinkLoad * 100).toFixed(2)}% (${item.stats.cpu.cores})\`
        ┊ RAM: \`${(item.stats.memory.used / 1024 / 1024).toFixed(2)}MB/${(item.stats.memory.reservable / 1024 / 1024).toFixed(2)}MB\`
        ╰ Uptime: \`${ms(item.stats.uptime)}\`
        `,
			})),
		};

		// Edit the previous message with the embed
		return await interaction.editReply({ embeds: [embed], content: null });
	}
}
