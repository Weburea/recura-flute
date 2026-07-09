'use client';
import { Button } from '@/components/ui/button';

import React, { useEffect, useState, useMemo } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import Image from 'next/image';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const mapMarkers = [
    { name: "Canada", coordinates: [-106, 56] as [number, number], image: "https://res.cloudinary.com/weburea/image/upload/v1783571821/tag.png" }, 
    { name: "Brazil", coordinates: [-58, -62] as [number, number], image: "https://res.cloudinary.com/weburea/image/upload/v1783571820/tag-3.png" },
    { name: "Germany", coordinates: [50, -18] as [number, number], image: "https://res.cloudinary.com/weburea/image/upload/v1783571818/tag-1.png" },
    { name: "Australia", coordinates: [110, -30] as [number, number], image: "https://res.cloudinary.com/weburea/image/upload/v1783571819/tag-2.png" },
];

export function Contact() {
  return (
    <section className="py-24 bg-white dark:bg-transparent relative overflow-hidden" id="contact">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="section-title text-dark dark:text-white">Contact Us</h2>
          <p className="section-description text-gray-600 dark:text-slate-300 mx-auto">
            Have a question or need support? Our team is ready to help you get the most out of Recura.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contact Form */}
          <div className="w-full max-w-lg mx-auto lg:mx-0">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="sr-only">Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Name"
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>

              <div>
                <label htmlFor="subject" className="sr-only">Subject</label>
                <input
                  type="text"
                  id="subject"
                  placeholder="Subject"
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>

              <div>
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Message"
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
                ></textarea>
              </div>

              <Button type="button" variant="brand" className="w-full py-6 rounded-xl font-medium text-lg">
                Send Message
              </Button>
            </form>
          </div>

          {/* Map */}
          <div className="relative w-full h-[400px] lg:h-[500px]">
            <WorldMap />
          </div>
        </div>
      </div>
    </section>
  );
}

function WorldMap() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [geographies, setGeographies] = useState<any[]>([]);

  useEffect(() => {
    fetch(geoUrl)
      .then((res) => res.json())
      .then((data) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parsed: any = feature(data, data.objects.countries);
        setGeographies(parsed.features);
      })
      .catch((err) => console.error("Failed to load map data", err));
  }, []);

  const projection = useMemo(() => {
    return geoMercator()
      .scale(100)
      .center([0, 20])
      .translate([800 / 2, 600 / 2]); 
  }, []);

  const pathGenerator = useMemo(() => geoPath().projection(projection), [projection]);

  return (
    <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <g>
        {geographies.map((geo, i) => (
          <path
            key={i}
            d={pathGenerator(geo) || ""}
            fill="#e5e7eb"
            stroke="#FFFFFF"
            strokeWidth={0.5}
            className="outline-none hover:fill-[#d1d5db] transition-colors cursor-pointer"
          />
        ))}
      </g>
      {mapMarkers.map(({ name, coordinates, image }) => {
        const coords = projection(coordinates as [number, number]);
        if (!coords) return null;
        const [x, y] = coords;
        return (
          <g key={name} transform={`translate(${x}, ${y})`}>
            <foreignObject x="-110" y="-120" width="220" height="120" className="overflow-visible">
              <div className="relative group cursor-pointer transition-transform hover:scale-110 hover:z-50 flex items-end justify-center w-full h-full">
                <Image 
                    src={image} 
                    alt={name} 
                    width={200} 
                    height={100} 
                    className="w-[200px] h-auto object-contain drop-shadow-xl mx-auto"
                />
              </div>
            </foreignObject>
          </g>
        );
      })}
    </svg>
  );
}
