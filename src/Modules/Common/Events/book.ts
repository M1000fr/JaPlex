import { books } from "@/Classes/Book";
import Event from "@/Classes/Event";
import { BaseMessageOptions } from "discord.js";

export const bookChangePageEvent = new Event<"interactionCreate">(
	"interactionCreate",
).setHandler(async (client, interaction) => {
	if (!interaction.isButton()) return false;

	const repliedUser = interaction.user;

	const book = books.get(interaction.message.id);
	if (!book) return false;

	if (repliedUser.id !== book.authorId) return false;

	let page: BaseMessageOptions | undefined = undefined;

	if (interaction.customId === "next") {
		page = book.nextPage();
	} else if (interaction.customId === "previous") {
		page = book.previousPage();
	} else if (interaction.customId === "cancel") {
		books.delete(interaction.message.id);
		await interaction.message.delete();
		return;
	}

	if (!page) return;

	await interaction.update(page);
});
