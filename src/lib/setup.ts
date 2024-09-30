/**
 * Sets the `NODE_ENV` environment variable to `'development'` if it is not set.
 *
 * @remarks
 * This is done to ensure that the `@sapphire/framework` logger is set to the
 * correct level (`LogLevel.Debug`) in development mode.
 */
process.env.NODE_ENV ??= "development";

import { ApplicationCommandRegistries, RegisterBehavior } from "@sapphire/framework";
import "@sapphire/plugin-api/register";
import "@sapphire/plugin-editable-commands/register";
import "@sapphire/plugin-logger/register";
import "@sapphire/plugin-subcommands/register";
import * as colorette from "colorette";
import { inspect } from "util";

/**
 * Sets the default behavior for the application command registries to bulk overwrite
 * when not identical. This means that if there is a difference between the local
 * and remote command registries, the remote registry will be overwritten with the
 * local one.
 */
ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.BulkOverwrite);

/**
 * Sets the default depth for the `util.inspect` function to 1. This means that
 * objects will be inspected at a depth of 1, which prevents the output from being
 * too verbose.
 */
inspect.defaultOptions.depth = 1;

/**
 * Creates a new instance of the `colorette` module with the default options set
 * to use color. This allows the `colorette` module to be used to colorize the
 * output of the logger.
 */
colorette.createColors({ useColor: true });
