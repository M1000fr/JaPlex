import Event from "@/Classes/Event";
import { PERMISSIONS } from "@/Constants/Permissions";
import { Prisma } from "@/Services/prisma.service";

export const RegisterPermissionsEvent = new Event<"ready">("ready").setHandler(async (_client) => {
	const permissions = await Prisma.permission.findMany();

	const permissionsNotRegistered = Object.values(PERMISSIONS).filter((permission) => {
		return !permissions.some((p) => p.name === permission);
	});

	if (permissionsNotRegistered.length === 0) return true;

	await Prisma.permission.createMany({
		data: permissionsNotRegistered.map((permission) => {
			return {
				name: permission,
			};
		}),
		skipDuplicates: true,
	});

	return true;
});
