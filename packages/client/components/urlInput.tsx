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
        className={`flex gap-2 bg-slate-100 p-5 rounded-lg border-2 ${
          error ? 'border-red-400' : 'border-transparent'
        }`}
      >
        <LinkIcon className="h-4 w-4 my-auto" />
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
          } w-28 h-12 px-6 py-2 text-white text-lg transition duration-150 ease-in-out rounded-lg bg-cyan-500 shadow-md shadow-cyan-500/40 hover:shadow-cyan-500/80 hover:bg-cyan-600`}
          onClick={onSubmit}
          disabled={isLoading}
          data-testid="shorten-button"
        >
          {isLoading ? <Loading /> : 'Shorten'}
        </Button>
      </div>
      {error && <p className="text-red-600 text-sm pt-2">{error}</p>}
    </div>
  );

  function IsEnterKey(event: KeyboardEvent<HTMLInputElement>) {
    return event.key === 'Enter';
  }
}
