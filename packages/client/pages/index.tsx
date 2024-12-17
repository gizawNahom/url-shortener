import { ShortenedUrl, shortenUrl } from '@/utilities/httpClient';
import { useState } from 'react';
import { UrlInput } from '@/components/urlInput';
import { ShortenedUrlRow } from '@/components/shortenedUrlRow';
import isUrlHttp from 'is-url-http';

export default function Index() {
  const [shortenedUrl, setShortenedUrl] = useState<ShortenedUrl>();
  const [link, setLink] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col items-center h-screen gap-y-36 sm:gap-y-14 justify-center p-6 sm:p-0">
      {displayHeader()}
      {displayCard()}
    </div>
  );

  function displayHeader() {
    return (
      <h1 className="font-semibold text-sky-600 text-4xl sm:text-5xl">
        Create Short Links
      </h1>
    );
  }

  function displayCard() {
    return (
      <div className="rounded shadow-xl py-4 px-3 w-full bg-transparent sm:w-[600px] sm:max-w-[600px] sm:px-7 sm:py-10">
        <UrlInput
          onLinkChange={(link: string) => setLink(link)}
          onSubmit={submit}
          error={error}
          isLoading={isLoading}
          link={link}
        />
        {shortenedUrl && <ShortenedUrlRow shortenedUrl={shortenedUrl} />}
      </div>
    );
  }

  async function submit() {
    if (isUrlHttp(link)) await sendRequest();
    else if (link === '') setError('Link is required');
    else setError('Invalid Link');
  }

  async function sendRequest() {
    setIsLoading(true);
    setShortenedUrl(await shortenUrl(link));
    setIsLoading(false);
    setLink('');
    setError('');
  }
}
