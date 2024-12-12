export function removeProtocol(url: string): string {
  const u = new URL(url);
  return u.hostname + u.pathname + u.search;
}
