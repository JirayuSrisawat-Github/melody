import { ApplyOptions } from "@sapphire/decorators";
import { Listener } from "@sapphire/framework";
import { StoreRegistryValue } from "@sapphire/pieces";
import { blue, gray, green, magenta, magentaBright, white, yellow } from "colorette";

const dev = process.env.NODE_ENV !== "production";

/**
 * The "ready" event listener class.
 *
 * This class listens for the "ready" event and logs a banner and some debug information when it is fired.
 *
 * @since 1.0.0
 */
@ApplyOptions<Listener.Options>({ once: true })
export class UserEvent extends Listener {
	/**
	 * The style of the banner.
	 *
	 * If we are in development mode, the style will be yellow. Otherwise, it will be blue.
	 */
	private readonly style = dev ? yellow : blue;

	/**
	 * Runs the listener when the event is fired.
	 *
	 * @since 1.0.0
	 */
	public override run(): void {
		this.printBanner();
		this.printStoreDebugInformation();
	}

	/**
	 * Prints the banner.
	 *
	 * @since 1.0.0
	 */
	private printBanner(): void {
		const success = green("+");

		const llc = dev ? magentaBright : white;
		const blc = dev ? magenta : blue;

		const line01 = llc("");
		const line02 = llc("");

		// Offset Pad
		const pad = " ".repeat(7);

		console.log(
			String.raw`
${line01} ${pad}[${success}] Gateway
${line02}${dev ? ` ${pad}${blc("<")}${llc("/")}${blc(">")} ${llc("DEVELOPMENT MODE")}` : ""}
		`.trim(),
		);
	}

	/**
	 * Prints the debug information.
	 *
	 * @since 1.0.0
	 */
	private printStoreDebugInformation(): void {
		const { client, logger } = this.container;
		const stores = [...client.stores.values()];
		const last = stores.pop()! as StoreRegistryValue;

		for (const store of stores) logger.info(this.styleStore(store, false));
		logger.info(this.styleStore(last, true));
	}

	/**
	 * Styles the store.
	 *
	 * @param store The store to style.
	 * @param last Whether the store is the last one.
	 * @since 1.0.0
	 * @returns The styled store.
	 */
	private styleStore(store: StoreRegistryValue, last: boolean): string {
		return gray(`${last ? "└─" : "├─"} Loaded ${this.style(store.size.toString().padEnd(3, " "))} ${store.name}.`);
	}
}
