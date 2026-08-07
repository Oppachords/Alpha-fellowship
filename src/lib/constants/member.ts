export const MEMBER_BASE_PATH = "/member";
export const MEMBER_LOGIN_PATH = "/member/login";
export const MEMBER_REGISTER_PATH = "/member/register";
export const MEMBERS_LANDING_PATH = "/members";

export const MEMBER_PUBLIC_PATHS = [
  MEMBER_LOGIN_PATH,
  MEMBER_REGISTER_PATH,
] as const;

export function isMemberProtectedPath(pathname: string) {
  return (
    pathname.startsWith(MEMBER_BASE_PATH) &&
    !MEMBER_PUBLIC_PATHS.some((path) => pathname === path)
  );
}
