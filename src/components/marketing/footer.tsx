import Link from 'next/link';
import { Instagram, Linkedin } from 'lucide-react';

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const products = [
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Integrations', href: '#integrations' },
];

const solutions = [
  { name: 'Small Businesses', href: '#' },
  { name: 'SaaS Startups', href: '#' },
  { name: 'Gyms & Fitness', href: '#' },
  { name: 'Agencies', href: '#' },
  { name: 'Subscrption Boxes', href: '#' },
];

const resources = [
  { name: 'Blog', href: '#' },
  { name: 'Help Center', href: '/dashboard/help' },
  { name: 'Documentation', href: '/dashboard/documentation' },
  { name: 'Tutorials', href: '/dashboard' },
];

const legal = [
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms of Service', href: '/terms-of-service' },
  { name: 'Cookie Policy', href: '#' },
];

const support = [
  { name: 'Contact Us', href: '#contact' },
  { name: 'Email: support@recure.com', href: 'mailto:support@recure.com' },
];

export function Footer() {
  return (
    <footer className="relative pt-20 pb-10 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-[image:var(--bg-gradient-branded)] opacity-90 pointer-events-none" />
        
        <div className="container relative z-10 mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
                
                {/* Products */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold text-white">Products</h3>
                    <ul className="flex flex-col gap-3">
                        {products.map((item) => (
                            <li key={item.name}>
                                <Link href={item.href} className="text-white/80 hover:text-white transition-colors text-sm">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                 {/* Solutions */}
                 <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold text-white">Solutions</h3>
                    <ul className="flex flex-col gap-3">
                        {solutions.map((item) => (
                            <li key={item.name}>
                                <Link href={item.href} className="text-white/80 hover:text-white transition-colors text-sm">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                 {/* Resources */}
                 <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold text-white">Resources</h3>
                    <ul className="flex flex-col gap-3">
                        {resources.map((item) => (
                            <li key={item.name}>
                                <Link href={item.href} className="text-white/80 hover:text-white transition-colors text-sm">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                 {/* Legal */}
                 <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold text-white">Legal</h3>
                    <ul className="flex flex-col gap-3">
                        {legal.map((item) => (
                            <li key={item.name}>
                                <Link href={item.href} className="text-white/80 hover:text-white transition-colors text-sm">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Support */}
                <div className="flex flex-col gap-4 lg:col-span-1">
                     <h3 className="text-xl font-semibold text-white">Support</h3>
                    <ul className="flex flex-col gap-3">
                        {support.map((item) => (
                            <li key={item.name}>
                                <Link href={item.href} className="text-white/80 hover:text-white transition-colors text-sm">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Socials */}
                 <div className="flex flex-col gap-4 lg:col-span-1">
                    <h3 className="text-xl font-semibold text-white">Socials</h3>
                    <div className="flex gap-4">
                        <Link href="#" className="text-white/80 hover:text-white transition-transform hover:scale-110 flex items-center justify-center">
                            <XIcon className="w-5 h-5 fill-current" />
                        </Link>
                         <Link href="#" className="text-white/80 hover:text-white transition-transform hover:scale-110">
                            <Linkedin className="w-6 h-6" />
                        </Link>
                         <Link href="#" className="text-white/80 hover:text-white transition-transform hover:scale-110">
                            <Instagram className="w-6 h-6" />
                        </Link>
                    </div>
                </div>

            </div>

             <div className="text-right text-white/60 text-xs">
                ©2026 Recura. All right reserved.
            </div>
        </div>
    </footer>
  );
}
