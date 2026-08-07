export const MEMBER_BASE_PATH = "/member";

export const MEMBER_PUBLIC_PATHS = [`${MEMBER_BASE_PATH}/register`] as const;

export function isMemberProtectedPath(pathname: string) {
  return (
    pathname.startsWith(MEMBER_BASE_PATH) &&
    !MEMBER_PUBLIC_PATHS.some((path) => pathname === path)
  );
}
