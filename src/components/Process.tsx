import { FileSearch, Factory, Wrench, Truck } from 'lucide-react';

const steps = [
  {
    icon: FileSearch,
    title: 'Design Review',
    description:
      'Our engineering team carefully analyzes your design files for manufacturability and provides optimization recommendations.',
  },
  {
    icon: Factory,
    title: 'Fabrication',
    description:
      'Using cutting-edge equipment, we manufacture your PCBs with precision etching, drilling, and plating processes.',
  },
  {
    icon: Wrench,
    title: 'Assembly',
    description:
      'Components are mounted using automated SMT and through-hole processes, followed by careful soldering and inspection.',
  },
  {
    icon: Truck,
    title: 'Testing & Delivery',
    description:
      'Rigorous quality checks ensure every board meets specifications before secure packaging and prompt shipment.',
  },
];

export default function Process() {
  return (
    <section id="process" className="py-24 bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Process
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            A streamlined workflow designed for efficiency and quality at every
            step
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/50 relative z-10">
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-navy-800 rounded-full flex items-center justify-center border-2 border-orange-500 z-20">
                        <span className="text-white font-bold text-sm">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-slate-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
