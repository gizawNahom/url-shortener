import { useState } from 'react';
import { ShortenedUrl } from '@/utilities/httpClient';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const Button = dynamic(() => import('@/components/button'), { ssr: false });

export function ShortenedUrlRow({
  shortenedUrl,
}: {
  shortenedUrl: ShortenedUrl;
}) {
  const COPY = 'Copy';
  const [copyButtonText, setCopyButtonText] = useState(COPY);

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
    return <p className="grow">{removeProtocol(shortenedUrl?.longUrl)}</p>;
  }

  function displayShortUrl() {
    return (
      <a
        className="text-cyan-500 hover:text-cyan-600"
        href={shortenedUrl?.shortUrl}
        target="_blank"
      >
        {removeProtocol(shortenedUrl?.shortUrl)}
      </a>
    );
  }

  function removeProtocol(url: string | undefined): string {
    const u = new URL(url || '');
    return u.hostname + u.pathname;
  }

  function displayChartsIcon() {
    return (
      <div className="h-7 w-8 px-2 py-1 hover:bg-slate-100 rounded-md hover:transition-all fill-slate-400 hover:fill-cyan-500">
        <Link href={`/stat${getSlugPath()}`}>
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            className="h-full w-full "
          >
            <title>Charts Icon</title>
            <g>
              <path d="M38,64V4c0-2.211-1.789-4-2-4h-4c-2.211,0-2,1.789-2,4v60H38z" />
              <path d="M18,64V20c0-2.211-1.789-4-2-4H14c-2.211,0-2,1.789-2,4v44H18z" />
              <path d="M58,36c0-2.211-1.789-4-2-4h-4c-2.211,0-2,1.789-2,4v28h8V36z" />
            </g>
          </svg>
        </Link>
      </div>
    );
  }

  function getSlugPath() {
    const u = new URL(shortenedUrl.shortUrl);
    return u.pathname;
  }

  function displayCopyButton() {
    return (
      <Button
        onClick={onCopyButtonClick}
        className="text-cyan-500 px-2 py-1 hover:bg-slate-100 rounded-md hover:transition-all"
        rippleColor="light"
      >
        {copyButtonText}
      </Button>
    );
  }

  function onCopyButtonClick() {
    copyShortUrlToClipBoard();
    setCopyButtonText('Copied');
    setCopyButtonTextAfter5Secs();

    function copyShortUrlToClipBoard() {
      navigator.clipboard.writeText(shortenedUrl?.shortUrl ?? '');
    }

    function setCopyButtonTextAfter5Secs() {
      setTimeout(() => setCopyButtonText(COPY), 5000);
    }
  }
}
