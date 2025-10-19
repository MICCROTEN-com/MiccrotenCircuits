import { Cpu, Boxes, ArrowRight } from 'lucide-react';

const capabilities = [
  {
    icon: Cpu,
    title: 'PCB Fabrication',
    description:
      'High-precision multi-layer PCB manufacturing with advanced materials. From single-sided to 32-layer boards, we handle complex designs with tight tolerances.',
    link: '#contact',
  },
  {
    icon: Boxes,
    title: 'SMT Assembly',
    description:
      'State-of-the-art surface mount technology assembly services. Automated pick-and-place systems ensure accuracy for components as small as 01005 packages.',
    link: '#contact',
  },
];

export default function Capabilities() {
  return (
    <section id="capabilities" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">
            Our Capabilities
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            End-to-end PCB manufacturing solutions tailored to your specific
            requirements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-orange-500"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-navy-900 mb-3">
                      {capability.title}
                    </h3>
                    <p className="text-slate-600 mb-4 leading-relaxed">
                      {capability.description}
                    </p>
                    <a
                      href={capability.link}
                      className="inline-flex items-center gap-2 text-orange-500 font-semibold hover:text-orange-600 transition-colors group/link"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
