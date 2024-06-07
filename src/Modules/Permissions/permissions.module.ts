import Module from "@/Classes/Module";

import { GroupsCommand } from "./Commands/groupsManager";

import { GroupsAutocomplete } from "./Events/groupsAutocomplete";
import { RegisterPermissionsEvent } from "./Events/init";
import { PermissionsAutocomplete } from "./Events/permissionsAutocomplete";

export const permissionsModule: Module = new Module("Permisisons")
	.addEvents([
		RegisterPermissionsEvent,
		GroupsAutocomplete,
		PermissionsAutocomplete,
	])
	.addCommands([GroupsCommand]);
