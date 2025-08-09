export function isValidPhone(phone: string): boolean {
  return /^998\d{9}$/.test(phone);
}

export function isStrongEnoughPassword(password: string): boolean {
  return typeof password === 'string' && password.length >= 6;
}

export function isValidTimeRange(startIso: string, endIso: string): boolean {
  const s = new Date(startIso).getTime();
  const e = new Date(endIso).getTime();
  return Number.isFinite(s) && Number.isFinite(e) && s < e;
}