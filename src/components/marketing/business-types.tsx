import Image from 'next/image';

const businessTypes = [
  {
    title: "SaaS",
    description: "Handle recurring billing, subscription tiers, and growth metrics in one unified dashboard",
    image: "https://res.cloudinary.com/weburea/image/upload/v1783571753/Garage-1.png",
    gradient: "from-blue-200 via-indigo-300 to-purple-300",
  },
  {
    title: "Agencies",
    description: "Bill clients on recurring retainers, track project revenue, and automate billing effortlessly",
    image: "https://res.cloudinary.com/weburea/image/upload/v1783571756/Garage-2.png",
    gradient: "from-indigo-200 via-purple-300 to-pink-300",
  },
  {
    title: "Enterprises",
    description: "Manage large-scale corporate billing, CRM integration, and enterprise contract terms",
    image: "https://res.cloudinary.com/weburea/image/upload/v1783571826/Small.png",
    gradient: "from-cyan-200 via-cyan-300 to-pink-300",
  },
  {
    title: "Startups",
    description: "Launch subscription products fast with automated payment recovery and real-time analytics",
    image: "https://res.cloudinary.com/weburea/image/upload/v1783571758/Garage-3.png",
    gradient: "from-cyan-200 via-blue-300 to-indigo-300",
  },
  {
    title: "Marketplaces",
    description: "Track merchant subscriptions, multi-vendor payout schedules, and order inventory",
    image: "https://res.cloudinary.com/weburea/image/upload/v1783571825/Shoe-store-1.png",
    gradient: "from-blue-200 via-cyan-300 to-purple-300",
  },
];

export function BusinessTypes() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="section-title tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
            One Platform For Every Subscription Business
          </h2>
          <div className="inline-block px-6 py-2 rounded-full text-md text-gray-800 dark:text-gray-300 mb-8">
            From SaaS and startups to agencies, enterprises, and marketplaces—Recura adapts to your business model
          </div>
          <div>
            <h4 className="px-4 py-1 rounded text-xl font-bold text-gray-800 dark:text-gray-300">
              Built For Recurring Revenue & Inventory Management.
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessTypes.map((type, index) => (
            <div
              key={index}
              className={`group relative rounded-xl p-6 bg-gradient-to-br ${type.gradient} hover:scale-[1.02] transition-transform duration-300 flex items-center gap-4 h-full shadow-lg shadow-purple-950/5`}
            >
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={type.image}
                  alt={type.title}
                  fill
                  className="object-contain drop-shadow-xl"
                  sizes="96px"
                />
              </div>
              
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">
                  {type.title}
                </h3>
                <p className="text-slate-800 text-sm leading-snug font-medium">
                  {type.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
