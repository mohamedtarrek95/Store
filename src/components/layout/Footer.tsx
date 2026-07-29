import Link from 'next/link';
import { Globe, Camera, MessageCircle, PlayCircle, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  shop: {
    title: 'Shop',
    links: [
      { label: 'All Products', href: '/products' },
      { label: 'Watches', href: '/products?category=watches' },
      { label: 'Bracelets', href: '/products?category=bracelets' },
      { label: 'Necklaces', href: '/products?category=necklaces' },
      { label: 'Rings', href: '/products?category=rings' },
    ],
  },
  support: {
    title: 'Support',
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
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight">
              LUXE <span className="text-sm text-muted-foreground">Accessories</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Premium fashion accessories crafted for those who appreciate elegance and quality.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Link href="#" className="rounded-full p-2 transition-colors hover:bg-accent">
                <Globe className="h-4 w-4" />
              </Link>
              <Link href="#" className="rounded-full p-2 transition-colors hover:bg-accent">
                <Camera className="h-4 w-4" />
              </Link>
              <Link href="#" className="rounded-full p-2 transition-colors hover:bg-accent">
                <MessageCircle className="h-4 w-4" />
              </Link>
              <Link href="#" className="rounded-full p-2 transition-colors hover:bg-accent">
                <PlayCircle className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 text-sm font-semibold">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-4">
            <span className="flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" /> hello@luxeaccessories.com
            </span>
            <span className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" /> +1 (555) 123-4567
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> New York, NY
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Luxe Accessories. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
