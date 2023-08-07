import { ReactNode, useEffect, useState } from 'react';
import { Loading } from './loading';

export function StatView({
  className,
  onFetchData,
  children,
  'data-testid': testId,
}: {
  className: string;
  onFetchData: () => Promise<unknown>;
  children: ReactNode;
  'data-testid'?: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    (async () => {
      await onFetchData();
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={className} data-testid={testId}>
      {isLoading ? displayLoading() : children}
    </div>
  );

  function displayLoading() {
    return (
      <div className="flex justify-center items-center">
        <Loading colored={true} />
      </div>
    );
  }
}
