import Link from 'next/link';

const footerLinks = {
  quickLinks: {
    title: 'Quick Links',
    links: [
      { label: 'All Products', href: '/products' },
      { label: 'Watches', href: '/products?category=watches' },
      { label: 'Bracelets', href: '/products?category=bracelets' },
      { label: 'Necklaces', href: '/products?category=necklaces' },
      { label: 'Rings', href: '/products?category=rings' },
    ],
  },
  customerService: {
    title: 'Customer Service',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Shipping & Returns', href: '/shipping' },
      { label: 'Size Guide', href: '/size-guide' },
      { label: 'Track Order', href: '/orders' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
};

export default function Footer() {
  return (
    <footer className="relative border-t bg-foreground/[0.02]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-foreground/[0.03] to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold tracking-tight font-[family-name:var(--font-heading)]">LUXE</span>
              <span className="block text-sm text-muted-foreground mt-1">Accessories</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Premium fashion accessories crafted for those who appreciate timeless elegance and uncompromising quality.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <SocialLink href="#" label="Instagram" />
              <SocialLink href="#" label="Facebook" />
              <SocialLink href="#" label="Twitter" />
              <SocialLink href="#" label="Pinterest" />
            </div>
          </div>

          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
              Newsletter
            </h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Subscribe for exclusive offers and new arrivals.
            </p>
            <form className="mt-4 flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                type="submit"
                className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t pt-8 sm:flex-row">
          <div className="flex items-center gap-4">
            <PaymentIcon label="Visa" />
            <PaymentIcon label="Mastercard" />
            <PaymentIcon label="PayPal" />
            <PaymentIcon label="Amex" />
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Luxe Accessories. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-200 hover:border-foreground hover:text-foreground"
    >
      <span className="text-xs font-medium">{label[0]}</span>
    </a>
  );
}

function PaymentIcon({ label }: { label: string }) {
  return (
    <div className="flex h-7 items-center rounded border border-border bg-background px-2 text-[10px] font-medium text-muted-foreground">
      {label}
    </div>
  );
}
