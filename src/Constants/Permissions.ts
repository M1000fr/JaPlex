export enum PERMISSIONS {
	// COMMON
	CMDS_ALL = "cmds.*",

	// PING
	CMDS_PING_BROADCAST = "cmds.ping.broadcast",
	CMDS_PING_SOLO = "cmds.ping.solo",

	// PLEX
	CMDS_PLEX_ADD_MOVIE = "cmds.plex.add.movie",
	CMDS_PLEX_ADD_SHOW = "cmds.plex.add.show",

	// GROUPS
	CMDS_GROUPS_LIST = "cmds.groups.list",
	CMDS_GROUPS_CREATE = "cmds.groups.create",
	CMDS_GROUPS_DELETE = "cmds.groups.delete",

	// GROUPS PERMISSIONS
	CMDS_GROUPS_PERMISSIONS_LIST = "cmds.groups.permissions.list",
}

export type PermissionType = keyof typeof PERMISSIONS;
