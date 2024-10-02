import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";
import { APIEmbed, GuildMember, Message } from "discord.js";
import { defaultVolume } from "../../config";
import ms from "ms";
import { pickRandom } from "../../lib/utils";
import { RandomLoadingMessage } from "../../lib/constants";

@ApplyOptions<Command.Options>({
	// The description of the command.
	description: "Plays a song.",
})
/**
 * The `play` command.
 *
 * @since 1.0.0
 */
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
			options: [
				{
					name: "query",
					description: "The query to search for.",
					type: 3,
					required: true,
				},
			],
		});
	}

	/**
	 * Runs the command when it is invoked.
	 *
	 * @param interaction The interaction that invoked the command.
	 * @since 1.0.0
	 */
	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<Message<boolean>> {
		/**
		 * Sends a loading message to the user.
		 */
		await interaction.reply({
			content: pickRandom(RandomLoadingMessage),
		});

		/**
		 * The query to search for.
		 */
		const query = interaction.options.getString("query", true);

		this.container.logger.debug(`Searching ${query} in ${interaction.guildId!}`);

		/**
		 * Searches for the query and returns the result.
		 */
		const result = await this.container.client.manager.search(query, interaction.user!);
		this.container.logger.debug(JSON.stringify(result));

		/**
		 * If the search result is an error or empty, reply with the error message.
		 */
		if ("error" === result.loadType || "empty" === result.loadType)
			return await interaction.editReply({
				embeds: [
					{
						color: 0xff0000,
						description: JSON.stringify(result, null, 2),
						title: result.loadType,
					},
				],
			});

		/**
		 * Gets the player for the guild or creates a new one if it doesn't exist.
		 */
		let player = this.container.client.manager.players.get(interaction.guildId!);
		if (!player) {
			this.container.logger.debug(`Creating new player for ${interaction.guildId!}`);
			player = this.container.client.manager.create({
				guild: interaction.guildId!,
				voiceChannel: (<GuildMember>interaction.member).voice.channelId!,
				textChannel: interaction.channelId!,
				volume: defaultVolume,
				selfDeafen: true,
				selfMute: false,
			});
		}

		/**
		 * If the search result is a single track, add it to the queue.
		 * If the search result is a playlist, add all the tracks to the queue.
		 */
		if ("track" === result.loadType || "search" === result.loadType) player.queue.add(result.tracks[0]);
		else if ("playlist" === result.loadType) player.queue.add(result.playlist!.tracks);
		this.container.logger.debug(`Added ${result.tracks[0].title} to queue in ${interaction.guildId!}`);

		/**
		 * If the player is not playing, play the first track in the queue.
		 * If the player is not connected, connect it.
		 */
		if (!player.playing) await player.play();
		if ("CONNECTED" !== player.state) player.connect();

		/**
		 * Creates an embed to send to the user.
		 */
		const embed: APIEmbed = {
			color: 0xeab676,
			description: `**${"playlist" === result.loadType ? result.playlist!.name : result.tracks[0].title}** - \`${ms(result.tracks[0].duration)}\``,
			author: {
				name: `Added ${"playlist" === result.loadType ? `${result.tracks.length} tracks` : "1 track"} to queue`,
				icon_url: this.container.client.user!.displayAvatarURL({ size: 4096, extension: "jpg" }),
			},
			footer: {
				text: `Requester ${interaction.user.username} | Node: ${player.node.options.identifier}`,
			},
		};

		/**
		 * Sends the embed to the user.
		 */
		return await interaction.editReply({ embeds: [embed] });
	}
}
