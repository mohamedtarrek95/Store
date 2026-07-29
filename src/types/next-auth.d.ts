import 'next-auth';

declare module 'next-auth' {
  interface User {
    isAdmin?: boolean;
    id?: string;
  }
  interface Session {
    user: {
      id?: string;
      isAdmin?: boolean;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    isAdmin?: boolean;
    id?: string;
  }
}
