import { ClickCount } from '@/components/clickCount';
import { Loading } from '@/components/loading';
import { StatHeading } from '@/components/statHeading';
import { TopDeviceTypes } from '@/components/topDeviceTypes';
import { Url, getUrl } from '@/utilities/httpClient';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Stat() {
  const [url, setUrl] = useState<Url>();
  const [showMoreStat, setShowStat] = useState(false);
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
    <div className="mx-auto w-1/2 mt-24 h-[calc(100vh-96px)]">
      {url ? displayPage() : displayLoading()}
    </div>
  );

  function displayPage() {
    return (
      <div className="flex flex-col gap-3 h-full">
        {displayHeading()}
        {displayContent()}
      </div>
    );

    function displayHeading() {
      return (
        <div className="mb-3">
          <StatHeading url={url as Url} />
        </div>
      );
    }

    function displayContent() {
      return hasNoClicks() ? displayPlaceHolder() : displayStats();

      function hasNoClicks() {
        return url?.totalClicks === 0;
      }

      function displayPlaceHolder() {
        return (
          <div className="flex flex-col justify-around items-center gap-12 grow">
            {displayPlaceholderChart()}
            <p className="text-2xl">There are no clicks yet</p>
          </div>
        );
      }

      function displayPlaceholderChart() {
        return (
          <svg className="h-44 w-44 fill-slate-100" viewBox="0 0 100 100">
            <title>Placeholder Chart</title>
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
        );
      }

      function displayStats() {
        return (
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-4">
              <ClickCount id={router.query.id as string} />
            </div>
            {showMoreStat ? (
              <div className="col-span-2">
                <TopDeviceTypes id={id} />
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowStat(true);
                }}
              >
                Show more stats
              </button>
            )}
          </div>
        );
      }
    }
  }

  function displayLoading() {
    return (
      <div className="flex justify-center items-center h-96">
        <Loading colored={true} />
      </div>
    );
  }

  function getId(): string {
    return router.query.id as string;
  }
}
