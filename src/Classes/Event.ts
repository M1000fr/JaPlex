import { ClientEvents } from "discord.js";
import ExtendedClient from "./ExtendedClient";

export default class Event<T extends keyof ClientEvents> {
	declare name: keyof ClientEvents;
	declare handler: (
		client: ExtendedClient<true>,
		...args: ClientEvents[T]
	) => Promise<void> | any;

	constructor(name: keyof ClientEvents) {
		this.name = name;
	}

	public setHandler(
		handler: (
			client: ExtendedClient<true>,
			...args: ClientEvents[T]
		) => Promise<void> | any,
	): this {
		this.handler = handler;
		return this;
	}
}
