import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote:
      'Miccroten Circuits delivered our complex 8-layer boards ahead of schedule with zero defects. Their attention to detail and communication throughout the process was outstanding.',
    author: 'Sarah Chen',
    position: 'Hardware Director',
    company: 'TechVision Industries',
    avatar: 'SC',
  },
  {
    quote:
      'We have been working with Miccroten for three years now. Their quick-turn prototype service has accelerated our product development cycle significantly, and their quality is consistently excellent.',
    author: 'Michael Rodriguez',
    position: 'Chief Engineer',
    company: 'Quantum Systems',
    avatar: 'MR',
  },
  {
    quote:
      'The team at Miccroten went above and beyond to help optimize our design for manufacturing. Their expertise saved us both time and money while improving the final product quality.',
    author: 'Jennifer Park',
    position: 'Product Manager',
    company: 'Apex Electronics',
    avatar: 'JP',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Real feedback from satisfied customers who trust us with their PCB
            manufacturing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 relative"
            >
              <div className="absolute -top-4 left-8">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Quote className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="mt-6 mb-6">
                <p className="text-slate-700 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-slate-300">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-navy-800 to-navy-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-navy-900">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-slate-600">
                    {testimonial.position}
                  </div>
                  <div className="text-sm text-orange-500 font-semibold">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
