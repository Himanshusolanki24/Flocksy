/**
 * The API authenticates with an email address, but Flocksy's farmers sign in
 * with a mobile number. A mobile number is mapped to a stable namespaced
 * address so signup and login always agree on the same identity — no backend
 * change, no second account for the same farmer.
 *
 * ponytail: swap this for a real `/auth/login-mobile` endpoint the day the API
 * accepts a phone number directly; only this file changes.
 */
const MOBILE_DOMAIN = "mobile.flocksy.in";

/** Keep only digits, dropping a leading +91 / 91 / 0 the farmer may have typed. */
export function normalizeMobile(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("91")) return digits.slice(-10);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

/** Indian mobile numbers are 10 digits starting 6–9. */
export function isValidMobile(input: string): boolean {
  return /^[6-9]\d{9}$/.test(normalizeMobile(input));
}

export function mobileToIdentifier(input: string): string {
  return `${normalizeMobile(input)}@${MOBILE_DOMAIN}`;
}

/** Pretty form for confirmation text: 98765 43210. */
export function formatMobile(input: string): string {
  const digits = normalizeMobile(input);
  return digits.length > 5
    ? `${digits.slice(0, 5)} ${digits.slice(5)}`
    : digits;
}
