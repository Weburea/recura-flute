import Image from 'next/image';

const brands = [
  { name: 'Xiaomi', src: 'https://res.cloudinary.com/weburea/image/upload/v1783571828/xiaomi%201.png', width: 240, height: 100 },
  { name: 'Redragon', src: 'https://res.cloudinary.com/weburea/image/upload/v1783571824/redragon%201.png', width: 240, height: 100 },
  { name: 'OnePlus', src: 'https://res.cloudinary.com/weburea/image/upload/v1783571822/oneplus-2%201.png', width: 240, height: 100 },
  { name: 'Lenovo', src: 'https://res.cloudinary.com/weburea/image/upload/v1783571814/lenovo%201.png', width: 240, height: 100 },
  { name: 'Yamaha', src: 'https://res.cloudinary.com/weburea/image/upload/v1783571829/yamaha%201.png', width: 240, height: 100 },
];

export function Brands() {
  return (
    <section className="py-8 bg-white dark:bg-transparent">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center border-y border-slate-200/60 dark:border-white/10 bg-slate-50/20 dark:bg-white/5 py-8 gap-6">
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm text-center tracking-wide">
            Powering billing for 12,000+ companies worldwide
          </p>
          
          <div className="w-full grid grid-cols-3 md:grid-cols-5 items-center gap-6 md:gap-0 opacity-65 dark:opacity-85 mix-blend-multiply dark:mix-blend-normal dark:invert">
            {brands.map((brand) => (
              <div 
                key={brand.name} 
                className="relative h-[56px] md:h-[96px] flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
              >
                <Image
                  src={brand.src}
                  alt={`${brand.name} logo`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 20vw, 200px"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
