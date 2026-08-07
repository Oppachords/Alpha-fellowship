export const ADMIN_BASE_PATH = "/church/admin";
export const ADMIN_LOGIN_PATH = "/church/admin/login";

export function isAdminProtectedPath(pathname: string) {
  return (
    pathname.startsWith(ADMIN_BASE_PATH) && pathname !== ADMIN_LOGIN_PATH
  );
}
