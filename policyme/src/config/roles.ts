/**
 * Role Configuration — Domain & Email-Based Mapping
 *
 * This file centralizes all role assignment logic.
 * Priority: EMAIL_ROLE_MAP > DOMAIN_ROLE_MAP > default ("Customer")
 */

export type AppRole = "Admin" | "Manager" | "Underwriter" | "Adjuster" | "Customer";

/**
 * Domain-wide role assignments.
 * Every user signing in with an email from these domains
 * will automatically receive the mapped role.
 */
export const DOMAIN_ROLE_MAP: Record<string, AppRole> = {
  "insurai.com": "Admin",
  // Add your organization domains below:
  // "yourcompany.com": "Admin",
  // "partner-adjusters.com": "Adjuster",
  // "uw-partners.com": "Underwriter",
};

/**
 * Per-email role overrides.
 * These take priority over domain mappings.
 * Use this to assign roles to specific individuals
 * who don't share a company domain.
 */
export const EMAIL_ROLE_MAP: Record<string, AppRole> = {
  // "john.adjuster@gmail.com": "Adjuster",
  // "sarah.uw@outlook.com": "Underwriter",
  // "ops-manager@hotmail.com": "Manager",
};

/**
 * Resolve the role for a given email address.
 * Priority: exact email match → domain match → "Customer"
 */
export function resolveRole(email: string | null | undefined): AppRole {
  if (!email) return "Customer";

  const normalizedEmail = email.toLowerCase().trim();

  // 1. Check per-email overrides first
  if (EMAIL_ROLE_MAP[normalizedEmail]) {
    return EMAIL_ROLE_MAP[normalizedEmail];
  }

  // 2. Check domain-wide mappings
  const domain = normalizedEmail.split("@")[1];
  if (domain && DOMAIN_ROLE_MAP[domain]) {
    return DOMAIN_ROLE_MAP[domain];
  }

  // 3. Default to Customer
  return "Customer";
}

/**
 * Route-to-role access control matrix.
 * Maps route prefixes to the roles allowed to access them.
 * Admin always has access to everything (enforced in middleware).
 */
export const ROUTE_ROLE_MAP: Record<string, AppRole[]> = {
  "/portal":                ["Customer", "Admin"],
  "/dashboard/adjuster":    ["Adjuster", "Admin"],
  "/dashboard/underwriter": ["Underwriter", "Admin"],
  "/dashboard/manager":     ["Manager", "Admin"],
  "/dashboard/admin":       ["Admin"],
};

/**
 * Public routes that don't require authentication.
 */
export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/api/auth",
];

/**
 * Get the default redirect path for a given role after sign-in.
 */
export function getDefaultRedirect(role: AppRole): string {
  switch (role) {
    case "Admin":       return "/dashboard/admin";
    case "Manager":     return "/dashboard/manager";
    case "Underwriter": return "/dashboard/underwriter";
    case "Adjuster":    return "/dashboard/adjuster";
    case "Customer":    return "/portal";
    default:            return "/portal";
  }
}
