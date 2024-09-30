import type { ChatInputCommandSuccessPayload, Command, ContextMenuCommandSuccessPayload, MessageCommandSuccessPayload } from "@sapphire/framework";
import { container } from "@sapphire/framework";
import { send } from "@sapphire/plugin-editable-commands";
import { cyan } from "colorette";
import { EmbedBuilder, type APIUser, type Guild, type Message, type User } from "discord.js";
import { RandomLoadingMessage } from "./constants";

/**
 * Returns a random element from the given array.
 *
 * @param {readonly T[]} array The array to pick from.
 * @returns {T} A random element from the array.
 */
export function pickRandom<T>(array: readonly T[]): T {
	const { length } = array;
	return array[Math.floor(Math.random() * length)];
}

/**
 * Sends a loading message to the given message.
 *
 * @param {Message} message The message to send the loading message to.
 * @returns {Promise<Message>} The message that was sent.
 */
export function sendLoadingMessage(message: Message): Promise<Message> {
	return send(message, {
		embeds: [new EmbedBuilder().setDescription(pickRandom(RandomLoadingMessage)).setColor("#FF0000")],
	});
}

/**
 * Logs a success command event.
 *
 * @param {ContextMenuCommandSuccessPayload | ChatInputCommandSuccessPayload | MessageCommandSuccessPayload} payload The payload of the command (either a ContextMenuCommandSuccessPayload, ChatInputCommandSuccessPayload, or MessageCommandSuccessPayload).
 */
export function logSuccessCommand(payload: ContextMenuCommandSuccessPayload | ChatInputCommandSuccessPayload | MessageCommandSuccessPayload): void {
	let successLoggerData: SuccessLoggerData;

	if ("interaction" in payload) {
		successLoggerData = getSuccessLoggerData(payload.interaction.guild, payload.interaction.user, payload.command);
	} else {
		successLoggerData = getSuccessLoggerData(payload.message.guild, payload.message.author, payload.command);
	}

	container.logger.debug(`${successLoggerData.shard} - ${successLoggerData.commandName} ${successLoggerData.author} ${successLoggerData.sentAt}`);
}

/**
 * Returns the formatted data for a success logger event.
 *
 * @param {Guild | null} guild The guild the command was executed in (or null if it was a direct message).
 * @param {User} user The user who executed the command.
 * @param {Command} command The command that was executed.
 * @returns {SuccessLoggerData} The formatted data for the success logger event.
 */
export function getSuccessLoggerData(guild: Guild | null, user: User, command: Command): SuccessLoggerData {
	const shard = getShardInfo(guild?.shardId ?? 0);
	const commandName = getCommandInfo(command);
	const author = getAuthorInfo(user);
	const sentAt = getGuildInfo(guild);

	return { shard, commandName, author, sentAt };
}

/**
 * Returns the formatted shard ID for a success logger event.
 *
 * @param {number} id The shard ID to format.
 * @returns {string} The formatted shard ID.
 */
function getShardInfo(id: number): string {
	return `[${cyan(id.toString())}]`;
}

/**
 * Returns the formatted command name for a success logger event.
 *
 * @param {Command} command The command to format.
 * @returns {string} The formatted command name.
 */
function getCommandInfo(command: Command): string {
	return cyan(command.name);
}

/**
 * Returns the formatted author for a success logger event.
 *
 * @param {User | APIUser} author The author to format.
 * @returns {string} The formatted author.
 */
function getAuthorInfo(author: User | APIUser): string {
	return `${author.username}[${cyan(author.id)}]`;
}

/**
 * Returns the formatted guild for a success logger event.
 *
 * @param {Guild | null} guild The guild to format (or null if it was a direct message).
 * @returns {string} The formatted guild.
 */
function getGuildInfo(guild: Guild | null): string {
	if (guild === null) return "Direct Messages";
	return `${guild.name}[${cyan(guild.id)}]`;
}

/**
 * The data for a success logger event.
 */
interface SuccessLoggerData {
	shard: string;
	commandName: string;
	author: string;
	sentAt: string;
}
