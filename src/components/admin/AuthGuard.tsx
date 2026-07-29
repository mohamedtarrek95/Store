'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log('[AUTH GUARD] status:', status, 'session:', !!session, 'pathname:', pathname);
    if (status === 'unauthenticated') {
      const callbackUrl = encodeURIComponent(pathname);
      console.log('[AUTH GUARD] no session, redirecting to /login?callbackUrl=' + callbackUrl);
      router.push('/login?callbackUrl=' + callbackUrl);
    }
  }, [status, pathname, router, session]);

  return <>{children}</>;
}