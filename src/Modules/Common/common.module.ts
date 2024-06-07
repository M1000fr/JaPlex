import Module from "@/Classes/Module";
import { PingCommand } from "./Commands/ping";
import { CommandHandlerEvent } from "./Events/commandHandler";
import { HelloEvent } from "./Events/hello";
import { RegisterUsersOnInit, UpdateUserOnLeave } from "./Events/users";
import { WelcomeEvent } from "./Events/welcome";

import {
	RegisterChannelsOnCreate,
	RegisterChannelsOnInit,
	UnregisterChannelOnDelete,
} from "./Events/channels";

import { bookChangePageEvent } from "./Events/book";
import {
	RegisterRoleOnCreate,
	RegisterRolesOnInit,
	UnregisterRoleOnDelete,
} from "./Events/roles";

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
	])
	.addCommands([PingCommand]);
