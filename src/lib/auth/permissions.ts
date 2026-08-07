const ADMIN_ROLES = ["super-admin", "admin", "editor", "pastor"] as const;

export function hasAdminRole(roles: string[] = []) {
  return roles.some((role) =>
    ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number])
  );
}

export function hasRole(roles: string[] = [], slug: string) {
  return roles.includes(slug);
}

export function isSuperAdmin(roles: string[] = []) {
  return roles.includes("super-admin");
}
