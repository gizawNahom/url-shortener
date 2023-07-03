import { ClickCount } from '@/components/clickCount';
import { useRouter } from 'next/router';

export default function Stat() {
  const router = useRouter();

  return (
    <div className="mx-auto h-screen w-1/2 my-8">
      <ClickCount id={router.query.id as string} />
    </div>
  );
}
