import { Manager, Player, Track, Node } from "sakulink";
import { Client } from "./Client";
import { nodes } from "../config";

/**
 * The Lavalink manager class.
 *
 * @since 1.0.0
 */
export class Lavalink extends Manager {
	private client: Client;

	/**
	 * The constructor for the Lavalink class.
	 *
	 * @param client The client instance.
	 * @since 1.0.0
	 */
	public constructor(client: Client) {
		super({
			autoMove: true,
			autoResume: true,
			autoPlay: true,
			defaultSearchPlatform: "youtube music",
			nodes: nodes,
			send: (guildId: string, payload: unknown) => client.guilds.cache.get(guildId)?.shard.send(payload),
		});

		this.client = client;
		this.loadEvents();
	}

	/**
	 * Loads the events for the Lavalink
	 *
	 * @since 1.0.0
	 */
	private loadEvents(): void {
		/**
		 * Fired when a node is created.
		 *
		 * @param node The node that was created.
		 * @since 1.0.0
		 */
		this.on("nodeCreate", (node: Node): void => {
			this.client.logger.debug(`Created node: ${node.options.identifier}`);
		});

		/**
		 * Fired when a node is connected to.
		 *
		 * @param node The node that was connected to.
		 * @since 1.0.0
		 */
		this.on("nodeConnect", (node: Node): void => {
			this.client.logger.info(`Connected to node: ${node.options.identifier}`);
		});

		/**
		 * Fired when a node is destroyed.
		 *
		 * @param node The node that was destroyed.
		 * @since 1.0.0
		 */
		this.on("nodeDestroy", (node: Node): void => {
			this.client.logger.debug(`Destroyed node: ${node.options.identifier}`);
		});

		/**
		 * Fired when a node is disconnected from.
		 *
		 * @param node The node that was disconnected from.
		 * @since 1.0.0
		 */
		this.on("nodeDisconnect", (node: Node): void => {
			this.client.logger.info(`Disconnected from node: ${node.options.identifier}`);
		});

		/**
		 * Fired when an error occurs in a node.
		 *
		 * @param node The node that the error occurred in.
		 * @param error The error that occurred.
		 * @since 1.0.0
		 */
		this.on("nodeError", (node: Node, error: Error): void => {
			this.client.logger.error(`Error in node: ${node.options.identifier}`, error);
		});

		/**
		 * Fired when a track starts playing.
		 *
		 * @param player The player that is playing the track.
		 * @param track The track that is playing.
		 * @since 1.0.0
		 */
		this.on("trackStart", (player: Player, track: Track): void => {
			this.client.logger.info(`Started playing ${track.title} in ${player.guild}[${player.node.options.identifier}]`);
		});

		/**
		 * Fired when a track gets stuck.
		 *
		 * @param player The player that is playing the track.
		 * @param track The track that is playing.
		 * @since 1.0.0
		 */
		this.on("trackStuck", (player: Player, track: Track): void => {
			this.client.logger.warn(`Stuck in ${player.guild} for ${track.title}[${player.node.options.identifier}]`);
		});

		/**
		 * Fired when a queue ends.
		 *
		 * @param player The player that the queue ended in.
		 * @since 1.0.0
		 */
		this.on("queueEnd", (player: Player): void => {
			this.client.logger.info(`Ended queue in ${player.guild}[${player.node.options.identifier}]`);

			/**
			 * Destroys the player if the queue is empty after 5 seconds.
			 * This is done to prevent the player from staying in the guild
			 * forever when the queue is empty.
			 */
			setTimeout(() => {
				const _player = this.client.manager.players.get(player.guild!)!;
				/**
				 * Gets the current track of the player.
				 * If there is no current track, the player is destroyed.
				 */
				this.client.logger.debug(`Checking if the queue is empty in ${player.guild}[${player.node.options.identifier}]`);
				if (!_player.queue.current) {
					this.client.logger.debug(`The queue is empty in ${player.guild}[${player.node.options.identifier}], destroying the player.`);
					player.destroy();
				}
			}, 5000);
		});
	}
}
