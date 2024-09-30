import { Events, Listener } from "@sapphire/framework";
import { VoicePacket, VoiceServer, VoiceState } from "sakulink";

/**
 * The "raw" event listener class.
 *
 * This class listens for the "raw" event and updates the voice state with the received data.
 *
 * @since 1.0.0
 */
export class RawListener extends Listener<typeof Events.Raw> {
	/**
	 * The public constructor for the listener.
	 *
	 * @param context The context in which the listener is being constructed.
	 * @param options The options for the listener.
	 */
	public constructor(context: Listener.LoaderContext, options: Listener.Options) {
		super(context, {
			...options,
			event: Events.Raw,
		});
	}

	/**
	 * The function that is called when the event is fired.
	 *
	 * @param data The data that is emitted by the event.
	 */
	public run(data: unknown): void {
		// Update the voice state with the received data
		this.container.client.manager.updateVoiceState(<VoicePacket | VoiceServer | VoiceState>data);
	}
}
