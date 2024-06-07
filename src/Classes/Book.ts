import {
	ActionRowBuilder,
	BaseMessageOptions,
	ButtonBuilder,
	ButtonStyle,
	Collection,
	MessageComponent,
} from "discord.js";

export const books = new Collection<string, Book>();

export class Book {
	private pages: Collection<number, BaseMessageOptions> = new Collection();
	public currentPageIndex: number = 1;
	public authorId: string | undefined;

	constructor({ authorId }: { authorId: string }) {
		this.authorId = authorId;
	}

	public addPage(payload: BaseMessageOptions): this {
		this.pages.set(this.pages.size + 1, payload);
		return this;
	}

	public buildPages(): Collection<number, BaseMessageOptions> {
		// Add next and previous buttons
		this.pages.forEach((page, index) => {
			const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
				new ButtonBuilder()
					.setCustomId("previous")
					.setLabel("Previous")
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder()
					.setCustomId("next")
					.setLabel("Next")
					.setStyle(ButtonStyle.Primary),
			]);

			if (!page.components) page.components = [];
			if (page.components.length >= 5)
				(page.components as MessageComponent[])?.splice(
					4,
					page.components.length - 4,
				);

			if (index === 1) {
				row.components[0].setDisabled(true);
				row.components[1].setDisabled(false);
			} else if (index === this.pages.size) {
				row.components[0].setDisabled(false);
				row.components[1].setDisabled(true);
			}

			(page.components as MessageComponent[])?.push(row);

			this.pages.set(index, page);
		});

		// If there is only one page, remove the buttons
		if (this.pages.size === 1) {
			this.pages.forEach((page) => {
				page.components = [];
				this.pages.set(1, page);
			});
		}

		return this.pages;
	}

	public nextPage(): BaseMessageOptions | undefined {
		this.currentPageIndex += 1;
		return this.pages.get(this.currentPageIndex);
	}

	public previousPage(): BaseMessageOptions | undefined {
		this.currentPageIndex -= 1;
		return this.pages.get(this.currentPageIndex);
	}

	public register(messageId: string): this {
		books.set(messageId, this);
		return this;
	}
}
