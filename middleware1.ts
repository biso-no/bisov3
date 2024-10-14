import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getLoggedInUser } from "./lib/actions/user";
import { getUserRoles } from "./app/actions/admin";

async function getUserPermissions() {
  try {
    const account = await getLoggedInUser();
    if (!account?.user.$id) return null;

    const roles = await getUserRoles();
    const permissions = {
      canEditPages: roles.includes("Admin") || roles.includes("PR"),
      canAccessAdminDashboard: ["Admin", "PR", "kk", "hr", "finance"].some(role => roles.includes(role)),
      account
    };

    return permissions;
  } catch (error) {
    console.error("Error fetching user or roles:", error);
    return null;
  }
}

function handleUnauthorizedRedirect(req: NextRequest, target: string) {
  return NextResponse.redirect(new URL(target, req.url));
}

function handleRewrite(req: NextRequest, newPath: string) {
  return NextResponse.rewrite(new URL(newPath, req.url));
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Fetch user permissions and account info
  const permissions = await getUserPermissions();
  if (!permissions?.account) {
    return handleUnauthorizedRedirect(req, "/auth/login");
  }

  const { canEditPages, canAccessAdminDashboard, account } = permissions;

  // Route guards
  const isEditRoute = req.nextUrl.pathname.endsWith("/edit");
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isPuckRoute = req.nextUrl.pathname.startsWith("/puck");

  // Restrict access to "/edit" routes
  if (isEditRoute) {
    if (!canEditPages) {
      return handleUnauthorizedRedirect(req, "/");
    }
    const pathWithoutEdit = req.nextUrl.pathname.slice(0, -5);
    const pathWithEditPrefix = `/puck${pathWithoutEdit}`;
    return handleRewrite(req, pathWithEditPrefix);
  }

  // Restrict access to "/puck" routes
  if (isPuckRoute && !canEditPages) {
    return handleUnauthorizedRedirect(req, "/");
  }

  // Restrict access to "/admin" routes for unauthorized users
  if (isAdminRoute && !canAccessAdminDashboard) {
    return handleUnauthorizedRedirect(req, "/auth/login");
  }

  return res;
}
