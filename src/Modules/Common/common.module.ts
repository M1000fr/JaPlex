import Module from "@/Classes/Module";
import { PlexCommand } from "./Commands/add";
import { PingCommand } from "./Commands/ping";
import { bookChangePageEvent } from "./Events/book";
import {
	RegisterChannelsOnCreate,
	RegisterChannelsOnInit,
	UnregisterChannelOnDelete,
} from "./Events/channels";
import { CommandHandlerEvent } from "./Events/commandHandler";
import { downloadTorrentButtonEvent } from "./Events/download";
import { HelloEvent } from "./Events/hello";
import {
	RegisterRoleOnCreate,
	RegisterRolesOnInit,
	UnregisterRoleOnDelete,
} from "./Events/roles";
import { RegisterUsersOnInit, UpdateUserOnLeave } from "./Events/users";
import { WelcomeEvent } from "./Events/welcome";
import { MovieAutocomplete } from "./Events/movieAutocomplete";

export const commonModule: Module = new Module("Common")
	.addEvents([
		HelloEvent,
		CommandHandlerEvent,
		WelcomeEvent,

		// Book
		bookChangePageEvent,

		// Users
		RegisterUsersOnInit,
		UpdateUserOnLeave,

		// Channels
		RegisterChannelsOnInit,
		RegisterChannelsOnCreate,
		UnregisterChannelOnDelete,

		// Roles
		RegisterRoleOnCreate,
		RegisterRolesOnInit,
		UnregisterRoleOnDelete,

		downloadTorrentButtonEvent,
		MovieAutocomplete,
	])
	.addCommands([PingCommand, PlexCommand]);
