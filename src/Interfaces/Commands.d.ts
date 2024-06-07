import { PermissionType } from "@/Constants/Permissions";

export interface CommandPermissions {
	or: PermissionType[];
	and: PermissionType[];
}
