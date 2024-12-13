import { KeyboardEvent, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Loading } from './loading';
import LinkIcon from './linkIcon';

const Button = dynamic(() => import('@/components/button'), { ssr: false });

export function UrlInput({
  onLinkChange,
  onSubmit,
  error,
  isLoading,
  link,
}: {
  onLinkChange: (link: string) => void;
  onSubmit: () => void;
  error: string;
  isLoading: boolean;
  link: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      <div
        className={`flex items-center justify-between gap-2 bg-slate-100 rounded-lg px-3 ${
          canDisplayError() ? 'border-red-400 border-2' : 'border-transparent border-0'
        } sm:p-5 sm:border-2`}
      >
        <LinkIcon className="hidden sm:block sm:h-4 sm:w-4 sm:my-auto" />
        <input
          type="text"
          name="url"
          id="url"
          placeholder="Enter link"
          onChange={(e) => onLinkChange(e.target.value)}
          className="w-96 bg-transparent border-none h-12 text-lg focus:outline-none text-cyan-500"
          onKeyDown={(event) => {
            if (IsEnterKey(event)) onSubmit();
          }}
          value={link}
          ref={inputRef}
        />
        <Button
          rippleColor="light"
          className={`${
            isLoading &&
            'cursor-not-allowed bg-cyan-500/60 hover:bg-cyan-500/60 hover:shadow-cyan-500/40'
          } text-white text-lg w-24 h-9 transition duration-150 ease-in-out rounded-lg bg-cyan-500 shadow-md shadow-cyan-500/40 hover:shadow-cyan-500/80 hover:bg-cyan-600 p-0 sm:px-6 sm:py-2 sm:w-28 sm:h-12`}
          onClick={onSubmit}
          disabled={isLoading}
          data-testid="shorten-button"
        >
          {isLoading ? <Loading /> : 'Shorten'}
        </Button>
      </div>
      {canDisplayError() && (
        <p className="text-red-600 text-sm pt-2">{error}</p>
      )}
    </div>
  );

  function IsEnterKey(event: KeyboardEvent<HTMLInputElement>) {
    return event.key === 'Enter';
  }

  function canDisplayError() {
    return error && !isLoading;
  }
}
