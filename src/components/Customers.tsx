import { useEffect, useRef, useState } from 'react';
import { Building2 } from 'lucide-react';

const customers = [
  { name: 'TechVision Industries', logo: 'TV' },
  { name: 'Quantum Systems', logo: 'QS' },
  { name: 'Apex Electronics', logo: 'AE' },
  { name: 'NextGen Solutions', logo: 'NG' },
  { name: 'Innovative Devices Inc', logo: 'ID' },
  { name: 'Global Tech Corp', logo: 'GT' },
  { name: 'Precision Manufacturing', logo: 'PM' },
  { name: 'Smart Systems Ltd', logo: 'SS' },
];

export default function Customers() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || isPaused) return;

    let scrollPosition = 0;
    const scroll = () => {
      scrollPosition += 0.5;
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      scrollContainer.scrollLeft = scrollPosition;
    };

    const intervalId = setInterval(scroll, 20);
    return () => clearInterval(intervalId);
  }, [isPaused]);

  const duplicatedCustomers = [...customers, ...customers];

  return (
    <section id="customers" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Proud partners with innovative companies across multiple sectors
          </p>
        </div>

        <div
          ref={scrollRef}
          className="overflow-hidden relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex gap-8 w-max">
            {duplicatedCustomers.map((customer, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-48 h-32 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center gap-3 border border-slate-200 hover:border-orange-500 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-navy-800 to-navy-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xl">
                    {customer.logo}
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-700 text-center px-2">
                  {customer.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
