import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="relative">
        <div className="absolute -inset-10 rounded-full bg-foreground/5 blur-3xl" />
        <h1 className="relative font-[family-name:var(--font-heading)] text-[10rem] font-bold leading-none tracking-tight text-foreground/10 sm:text-[12rem]">
          404
        </h1>
      </div>
      <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight mt-[-1rem]">
        Page Not Found
      </h2>
      <p className="text-muted-foreground mt-3 max-w-md">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <div className="flex gap-4 mt-8">
        <Link
          href="/"
          className="inline-flex h-12 items-center rounded-xl bg-foreground px-8 text-sm font-medium text-background transition-all duration-200 hover:opacity-90"
        >
          Go Home
        </Link>
        <Link
          href="/products"
          className="inline-flex h-12 items-center rounded-xl border border-input px-8 text-sm font-medium transition-all duration-200 hover:bg-accent"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}
