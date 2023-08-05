export function getUrlsBasePath() {
  return '/api/urls';
}

export function getTopDeviceTypesPath(id: string) {
  return `${getUrlsBasePath()}/${id}/top-device-types`;
}

export function getClickCountPath(id: string) {
  return `${getUrlsBasePath()}/${id}/total-clicks-by-day`;
}

export function getUrlsPath(id: string) {
  return `${getUrlsBasePath()}/${id}`;
}
