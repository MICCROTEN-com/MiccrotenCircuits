import Hero from '../components/Hero';
import Capabilities from '../components/Capabilities';
import Process from '../components/Process';
import Portfolio from '../components/Portfolio';
import Customers from '../components/Customers';
import Testimonials from '../components/Testimonials';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Capabilities />
      <Process />
      <Portfolio />
      {/* <Customers /> */}
      {/* <Testimonials /> */}
    </>
  );
}
