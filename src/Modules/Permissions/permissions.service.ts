import { PERMISSIONS } from "@/Constants/Permissions";
import { CommandPermissions } from "@/Interfaces/Commands";
import { Prisma } from "@/Services/prisma.service";
import { Group } from "@prisma/client";
import { GuildMember } from "discord.js";

export class PermissionsService {
	static async hasGroupPriority(group1: Group | null, group2: Group | null) {
		return (group1?.priority ?? 0) > (group2?.priority ?? 0);
	}

	static async getMemberHighestGroup(
		member: GuildMember,
	): Promise<Group | null> {
		return await Prisma.group.findFirst({
			where: {
				roleId: { in: member.roles.cache.map((role) => role.id) },
			},
			orderBy: { priority: "asc" },
		});
	}

	static async userHasPermissions({
		member,
		permissions,
	}: {
		member: GuildMember;
		permissions: CommandPermissions;
	}): Promise<{
		hasPermission: boolean;
		missingPermissions: string[];
		orRequiredOnePermission: string[];
	}> {
		await Prisma.user.upsert({
			where: { id: member.id },
			update: {},
			create: {
				id: member.id,
			},
		});

		let userGroups = await Prisma.group.findMany({
			where: {
				roleId: { in: member.roles.cache.map((role) => role.id) },
			},
			include: { Permissions: true },
		});

		const userPermissions = userGroups.map((group) =>
			group.Permissions.map((permission) => permission.name),
		);

		const userPermissionsFlat = userPermissions.flat();

		const hasAllAndPermissions =
				permissions.and.length > 0
					? permissions.and.every((permission) =>
							userPermissionsFlat.includes(
								PERMISSIONS[permission],
							),
						)
					: null,
			hasAllOrPermissions = permissions.or.some((permission) =>
				userPermissionsFlat.includes(PERMISSIONS[permission]),
			);

		if (hasAllAndPermissions || hasAllOrPermissions) {
			return {
				hasPermission: true,
				missingPermissions: [],
				orRequiredOnePermission: [],
			};
		}

		const missingAndPermissions = permissions.and.filter(
				(permission) =>
					!userPermissionsFlat.includes(PERMISSIONS[permission]),
			),
			missingOrPermissions = permissions.or.filter(
				(permission) =>
					!userPermissionsFlat.includes(PERMISSIONS[permission]),
			);

		return {
			hasPermission: false,
			missingPermissions: missingAndPermissions,
			orRequiredOnePermission: missingOrPermissions,
		};
	}
}
