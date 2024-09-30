import { join } from "path";

/**
 * The path to the root directory of the project.
 */
export const rootDir: string = join(__dirname, "..", "..");

/**
 * The path to the source directory of the project.
 */
export const srcDir: string = join(rootDir, "src");

/**
 * An array of random loading messages that can be used in the bot.
 */
export const RandomLoadingMessage: readonly string[] = ["Computing...", "Thinking...", "Cooking some food", "Give me a moment", "Loading..."];
