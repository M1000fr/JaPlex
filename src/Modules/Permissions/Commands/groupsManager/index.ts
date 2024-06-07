import Command from "@/Classes/Command";

import { groupsCommandOptions } from "./options";

import { AddGroupHandler } from "./groups/add";
import { DeleteGroupHandler } from "./groups/delete";
import { ListGroupsHandler } from "./groups/list";

import { ListGroupPermissionsHandler } from "./permissions/list";

export const GroupsCommand = new Command("groups", groupsCommandOptions)
	.setHandler({
		sub: "list",
		permission: {
			or: ["CMDS_ALL"],
			and: ["CMDS_GROUPS_LIST"],
		},
		handler: ListGroupsHandler,
	})
	.setHandler({
		sub: "create",
		permission: {
			or: ["CMDS_ALL"],
			and: ["CMDS_GROUPS_CREATE"],
		},
		handler: AddGroupHandler,
	})
	.setHandler({
		sub: "delete",
		permission: {
			or: ["CMDS_ALL"],
			and: ["CMDS_GROUPS_DELETE"],
		},
		handler: DeleteGroupHandler,
	})
	.setHandler({
		sub: "list",
		subGroup: "permissions",
		permission: {
			or: ["CMDS_ALL"],
			and: ["CMDS_GROUPS_PERMISSIONS_LIST"],
		},
		handler: ListGroupPermissionsHandler,
	});
