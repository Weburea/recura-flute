'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from 'next-themes';

interface AuthLayoutProps {
  children?: React.ReactNode;
  imageSrc: string;
  darkImageSrc?: string;
  imageAlt?: string;
  title?: string;
  subtitle?: string;
  reverse?: boolean; // If true, image is on the right
}

export function AuthLayout({ 
  children, 
  imageSrc, 
  darkImageSrc,
  imageAlt = "Authentication Dashboard Preview", 
  title = "Turn Data Into Clear Decisions",
  subtitle = "See trends, track performance, and grow with confidence",
  reverse = false 
}: AuthLayoutProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';
  const activeImage = (isDark && darkImageSrc) ? darkImageSrc : imageSrc;

  return (
    <div className="h-screen flex w-full bg-white dark:bg-[#0D0518] relative overflow-hidden">
      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors bg-white/80 dark:bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm hover:shadow-md border border-transparent dark:border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium text-sm">Back to Home</span>
        </Link>
      </div>

      <div className={`flex w-full h-full ${reverse ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Gradient Side Panel */}
        <div 
          className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-center items-center p-12 text-white"
          style={{
            background: 'linear-gradient(135deg, #A28CFF 0%, #8A3BF5 100%)'
          }}
        >
           <div className="max-w-xl w-full z-10 space-y-8">
              <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-sm">
                    {title}
                  </h1>
                  <p className="text-lg text-white/90 leading-relaxed max-w-md drop-shadow-sm">
                    {subtitle}
                  </p>
              </div>

              {/* Floating Dashboard Image Container */}
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500 bg-white/10 backdrop-blur-sm p-2">
                 <div className="relative w-full h-full rounded-lg overflow-hidden">
                    {mounted ? (
                        <Image
                            src={activeImage}
                            alt={imageAlt}
                            fill
                            className="object-cover object-top"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-white/5 animate-pulse" />
                    )}
                 </div>
              </div>
           </div>

           {/* Decorative Elements */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-900/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white dark:bg-[#0D0518] relative overflow-y-auto">
           {/* Logo Top Right */}
            <div className="absolute top-6 right-6 flex items-center">
                 <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571838/logo_dark.svg" alt="Recura" width={100} height={32} className="w-auto h-5 dark:hidden object-contain" priority />
                 <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571835/logo.svg" alt="Recura" width={100} height={32} className="w-auto h-5 hidden dark:block object-contain" priority />
            </div>

          <div className="w-full max-w-md space-y-8 py-12 lg:py-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
