import Command from "./Command";
import Event from "./Event";
import ExtendedClient from "./ExtendedClient";

export default class Module {
	public Events: Event<any>[] = [];
	public Commands: Command[] = [];

	declare name: string;

	constructor(name: string) {
		this.name = name;
	}

	public init(
		client: ExtendedClient<any>,
		skipEvents: boolean = false,
	): void {
		if (skipEvents) return;

		this.Events.forEach((event) => {
			client.on(event.name, (...args) => event.handler(client, ...args));
		});
	}

	public addEvents(event: Event<any>[]): this {
		this.Events.push(...event);
		return this;
	}

	public addCommands(command: Command[]): this {
		this.Commands.push(...command);
		return this;
	}
}
