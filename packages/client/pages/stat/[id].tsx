import { ClickCount } from '@/components/clickCount';
import { Loading } from '@/components/loading';
import { Url, getUrl } from '@/utilities/httpClient';
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
    <div className="mx-auto h-screen w-1/2 my-8">
      {url ? displayPage() : displayLoading()}
    </div>
  );

  function displayPage() {
    return (
      <div>
        <p>{url?.shortUrl}</p>
        <p>{url?.longUrl}</p>
        {hasNoClicks() ? (
          <p>There are no clicks yet</p>
        ) : (
          <ClickCount id={router.query.id as string} />
        )}
      </div>
    );
  }

  function hasNoClicks() {
    return url?.totalClicks === 0;
  }

  function displayLoading() {
    return <Loading />;
  }

  function getId(): string {
    return router.query.id as string;
  }
}
