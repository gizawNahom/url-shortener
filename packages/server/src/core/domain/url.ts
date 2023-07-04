export class Url {
  constructor(
    private longUrl: string,
    private shortenedId: string,
    private totalClicks: number
  ) {}
  getLongUrl() {
    return this.longUrl;
  }

  getShortenedId() {
    return this.shortenedId;
  }
}
