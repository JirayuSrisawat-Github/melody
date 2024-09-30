import "./lib/setup";

/**
 * The main entry point for Melody.
 *
 * @since 1.0.0
 */
import { Client } from "./structures/Client";

/**
 * The client instance for Melody.
 *
 * @since 1.0.0
 */
export const client: Client = new Client();

/**
 * Starts the client.
 *
 * @since 1.0.0
 */
client.start();
