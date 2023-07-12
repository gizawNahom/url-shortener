import { removeProtocol } from '@/utilities/removeProtocol';
import LinkIcon from './linkIcon';
import Link from 'next/link';
import { Url } from '@/utilities/httpClient';
import dynamic from 'next/dynamic';

const CopyButton = dynamic(() => import('@/components/copyButton'), {
  ssr: false,
});

export function StatHeading({ url }: { url: Url }) {
  return (
    <div>
      <div className="flex flex-row gap-5 mb-4">
        <div className="flex flex-row gap-3 items-center grow">
          {displayLinkIcon()}
          {displayShortUrl()}
        </div>
        {displayVisitUrlLink()}
        {displayCopyButton()}
      </div>
      {displayLongUrl()}
    </div>
  );

  function displayLinkIcon() {
    return <LinkIcon className="h-4 w-4 stroke-cyan-500" />;
  }

  function displayShortUrl() {
    return (
      <p className=" text-2xl">{removeProtocol(url?.shortUrl as string)}</p>
    );
  }

  function displayVisitUrlLink() {
    return (
      <Link
        href={url.shortUrl}
        target="_blank"
        className="flex flex-row items-center"
      >
        {displayVisitUrlIcon()}
      </Link>
    );

    function displayVisitUrlIcon() {
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className=" stroke-black/50 hover:stroke-cyan-500 duration-200 w-6 h-6"
        >
          <title>Visit URL</title>
          <path
            d="M11 4H4V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V13"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="M9 15L20 4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="M15 4H20V9"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      );
    }
  }

  function displayCopyButton() {
    return <CopyButton text={url.shortUrl}>{displayCopyIcon()}</CopyButton>;

    function displayCopyIcon() {
      return (
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className=" fill-black/50 hover:fill-cyan-500 duration-200 w-6 h-6"
        >
          <title>Copy</title>
          <path d="M 13.379213,2 H 10.077029 C 8.5810232,1.99999 7.3960546,1.99997 6.4686753,2.1476 5.5142541,2.29953 4.7417574,2.61964 4.1325468,3.34096 3.5233447,4.06227 3.2529763,4.97692 3.1246608,6.10697 2.9999745,7.205 2.9999915,8.60802 3,10.3793 v 5.8376 c 0,1.5081 0.7800945,2.8005 1.8885843,3.3423 -0.057052,-0.9094 -0.057009,-2.1855 -0.056958,-3.2472 V 11.3976 11.3024 C 4.8315664,10.0207 4.8315071,8.91644 4.9319243,8.03211 5.0395408,7.08438 5.2822312,6.17592 5.9045685,5.43906 6.5269058,4.70219 7.2941789,4.41485 8.0946164,4.28743 8.8415042,4.16854 9.7742172,4.1686 10.856657,4.16867 l 0.08039,1e-5 h 2.442168 l 0.08039,-1e-5 c 1.08244,-7e-5 2.013093,-1.3e-4 2.759989,0.11876 C 15.772792,2.94779 14.669492,2 13.379213,2 Z" />
          <path d="m 6.6001,11.3974 c 0,-2.72621 0,-4.0893 0.7029417,-4.93622 C 8.0059833,5.61426 9.1373583,5.61426 11.4001,5.61426 h 2.4 c 2.26275,0 3.394083,0 4.097083,0.84692 C 18.6001,7.3081 18.6001,8.6712 18.6001,11.3974 v 4.8193 c 0,2.7262 0,4.0893 -0.702917,4.9362 -0.703,0.8469 -1.834333,0.8469 -4.097083,0.8469 h -2.4 c -2.2627417,0 -3.3941167,0 -4.0970583,-0.8469 C 6.6001,20.306 6.6001,18.9429 6.6001,16.2167 Z" />
        </svg>
      );
    }
  }

  function displayLongUrl() {
    return (
      <p className=" text-base text-black/50 font-medium">{url?.longUrl}</p>
    );
  }
}
