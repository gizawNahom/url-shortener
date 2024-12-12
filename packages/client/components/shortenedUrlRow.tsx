import { ShortenedUrl } from '@/utilities/httpClient';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { removeProtocol } from '@/utilities/removeProtocol';

const CopyButton = dynamic(() => import('@/components/copyButton'), {
  ssr: false,
});

export function ShortenedUrlRow({
  shortenedUrl,
}: {
  shortenedUrl: ShortenedUrl;
}) {
  return (
    <div role="list" className="pt-4">
      <div
        role="listitem"
        className="flex flex-row justify-between items-center gap-x-2 text-lg"
      >
        {displayLongUrl()}
        {displayShortUrl()}
        {displayChartsIcon()}
        {displayCopyButton()}
      </div>
    </div>
  );

  function displayLongUrl() {
    return <p className="grow max-w-[55%] text-ellipsis whitespace-nowrap overflow-hidden">{removeProtocol(shortenedUrl?.longUrl)}</p>;
  }

  function displayShortUrl() {
    return (
      <a
        className="text-cyan-500 hover:text-cyan-600 text-ellipsis whitespace-nowrap overflow-hidden"
        href={shortenedUrl?.shortUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {removeProtocol(shortenedUrl?.shortUrl)}
      </a>
    );
  }

  function displayChartsIcon() {
    return (
      <Link
        href={`/stat${getSlugPath()}`}
        target="_blank"
        className="px-2 py-2 hover:bg-slate-100 rounded-md hover:transition-all fill-black/40 hover:fill-cyan-500"
      >
        <svg
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 68 68"
          className="h-4 w-4 "
        >
          <title>Charts Icon</title>
          <g>
            <path d="M38,64V4c0-2.211-1.789-4-2-4h-4c-2.211,0-2,1.789-2,4v60H38z" />
            <path d="M18,64V20c0-2.211-1.789-4-2-4H14c-2.211,0-2,1.789-2,4v44H18z" />
            <path d="M58,36c0-2.211-1.789-4-2-4h-4c-2.211,0-2,1.789-2,4v28h8V36z" />
          </g>
        </svg>
      </Link>
    );
  }

  function getSlugPath() {
    const u = new URL(shortenedUrl.shortUrl);
    return u.pathname;
  }

  function displayCopyButton() {
    return (
      <CopyButton
        text={shortenedUrl.shortUrl}
        className="text-cyan-500 px-2 py-1 hover:bg-slate-100 rounded-md hover:transition-all"
      >
        Copy
      </CopyButton>
    );
  }
}
