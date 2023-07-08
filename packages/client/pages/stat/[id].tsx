import { ClickCount } from '@/components/clickCount';
import LinkIcon from '@/components/linkIcon';
import { Loading } from '@/components/loading';
import { Url, getUrl } from '@/utilities/httpClient';
import { removeProtocol } from '@/utilities/removeProtocol';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Stat() {
  const [url, setUrl] = useState<Url>();
  const router = useRouter();
  const id = getId();

  useEffect(() => {
    (async () => {
      if (id) {
        try {
          setUrl(await getUrl(id));
        } catch (error) {
          router.push('/');
        }
      }
    })();
  }, [id, router]);

  return (
    <div className="mx-auto w-1/2 mt-24">
      {url ? displayPage() : displayLoading()}
    </div>
  );

  function displayPage() {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-row gap-3">
          {displayLinkIcon()}
          <p className="text-2xl">{removeProtocol(url?.shortUrl as string)}</p>
        </div>
        <p className="text-sm text-gray-500">{url?.longUrl}</p>
        {hasNoClicks() ? (
          <div className="flex flex-col justify-center items-center h-96 gap-12">
            <svg className="h-44 w-44 fill-slate-100" viewBox="0 0 100 100">
              <rect
                className="fill-cyan-100"
                x="12"
                y="70"
                width="15"
                height="20"
                rx="2"
                ry="2"
              />
              <rect
                className=" fill-cyan-200"
                x="32"
                y="50"
                width="15"
                height="40"
                rx="2"
                ry="2"
              />
              <rect
                className=" fill-cyan-300"
                x="52"
                y="20"
                width="15"
                height="70"
                rx="2"
                ry="2"
              />
              <rect
                className=" fill-cyan-400"
                x="72"
                y="10"
                width="15"
                height="80"
                rx="2"
                ry="2"
              />
              <rect x="0" y="90" width="99" height="4" rx="5" />
            </svg>
            <p className="text-2xl">There are no clicks yet</p>
          </div>
        ) : (
          <ClickCount id={router.query.id as string} />
        )}
      </div>
    );

    function displayLinkIcon() {
      return <LinkIcon color="cyan-500" />;
    }
  }

  function hasNoClicks() {
    return url?.totalClicks === 0;
  }

  function displayLoading() {
    const randInt = Math.floor(Math.random() * (2000 - 1 + 1)) + 1;
    return (
      <div className="flex justify-center items-center h-96">
        <Loading colored={true} key={randInt} />
      </div>
    );
  }

  function getId(): string {
    return router.query.id as string;
  }
}
