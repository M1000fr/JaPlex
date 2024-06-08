import Module from "@/Classes/Module";
import { PlexCommand } from "./Commands/add";
import { PingCommand } from "./Commands/ping";
import { bookChangePageEvent } from "./Events/book";

import { CommandHandlerEvent } from "./Events/commandHandler";
import { downloadTorrentButtonEvent } from "./Events/download";
import { HelloEvent } from "./Events/hello";
import { MovieAutocomplete } from "./Events/movieAutocomplete";
import {
	RegisterRoleOnCreate,
	RegisterRolesOnInit,
	UnregisterRoleOnDelete,
} from "./Events/roles";
import { RegisterUsersOnInit } from "./Events/users";

export const commonModule: Module = new Module("Common")
	.addEvents([
		HelloEvent,
		CommandHandlerEvent,

		// Book
		bookChangePageEvent,

		// Users
		RegisterUsersOnInit,

		// Roles
		RegisterRoleOnCreate,
		RegisterRolesOnInit,
		UnregisterRoleOnDelete,

		downloadTorrentButtonEvent,
		MovieAutocomplete,
	])
	.addCommands([PingCommand, PlexCommand]);
