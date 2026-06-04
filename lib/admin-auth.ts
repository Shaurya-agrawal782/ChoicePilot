import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

export async function verifyAdmin() {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized", status: 401 as const };
  }
  if (session.user.role !== UserRole.ADMIN) {
    return { error: "Forbidden", status: 403 as const };
  }
  return { user: session.user, status: 200 as const };
}
