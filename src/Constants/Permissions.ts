export enum PERMISSIONS {
	CMDS_ALL = "cmds.*",
	CMDS_PING_BROADCAST = "cmds.ping.broadcast",
	CMDS_PING_SOLO = "cmds.ping.solo",
	CMDS_GROUPS_LIST = "cmds.groups.list",
	CMDS_GROUPS_CREATE = "cmds.groups.create",
	CMDS_GROUPS_DELETE = "cmds.groups.delete",
	CMDS_GROUPS_PERMISSIONS_LIST = "cmds.groups.permissions.list",
}

export type PermissionType = keyof typeof PERMISSIONS;
