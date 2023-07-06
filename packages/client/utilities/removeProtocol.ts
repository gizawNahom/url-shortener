// export function removeProtocol(url: string | undefined): string {
export function removeProtocol(url: string): string {
  //   const u = new URL(url || '');
  const u = new URL(url);
  return u.hostname + u.pathname;
}
