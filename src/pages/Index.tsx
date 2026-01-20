import Header from "@/components/Header";
import HomeSidebar from "@/components/HomeSidebar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Testimonial from "@/components/Testimonial";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Fixed sidebar - desktop only */}
      <HomeSidebar />
      
      {/* Header with auth buttons */}
      <Header />
      
      {/* Main content - offset for sidebar on desktop */}
      <main className="lg:ml-[220px]">
        <Hero />
        <HowItWorks />
        <Testimonial />
        <CTA />
        <Footer />
      </main>
    </div>
  );
};

export default Index;
