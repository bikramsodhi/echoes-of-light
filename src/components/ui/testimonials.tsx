"use client";

import { useEffect, useState, useRef } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { User } from "lucide-react";

interface Testimonial {
  quote: string;
  description: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
  title?: string;
}

function Testimonials({ testimonials, title = "What people say when they see it" }: TestimonialsProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll every 4 seconds
  useEffect(() => {
    if (!api) return;

    const interval = setTimeout(() => {
      api.scrollNext();
      if (api.selectedScrollSnap() + 1 >= api.scrollSnapList().length) {
        api.scrollTo(0);
      }
      setCurrent(prev => prev + 1);
    }, 4000);

    return () => clearTimeout(interval);
  }, [api, current]);

  const startHoverScroll = (direction: 'next' | 'prev') => {
    if (!api) return;
    
    // Clear any existing interval
    if (hoverIntervalRef.current) {
      clearInterval(hoverIntervalRef.current);
    }
    
    // Scroll immediately
    if (direction === 'next') {
      api.scrollNext();
      if (api.selectedScrollSnap() + 1 >= api.scrollSnapList().length) {
        api.scrollTo(0);
      }
    } else {
      if (api.selectedScrollSnap() === 0) {
        api.scrollTo(api.scrollSnapList().length - 1);
      } else {
        api.scrollPrev();
      }
    }
    setCurrent(prev => prev + 1);
    
    // Continue scrolling while hovering
    hoverIntervalRef.current = setInterval(() => {
      if (direction === 'next') {
        api.scrollNext();
        if (api.selectedScrollSnap() + 1 >= api.scrollSnapList().length) {
          api.scrollTo(0);
        }
      } else {
        if (api.selectedScrollSnap() === 0) {
          api.scrollTo(api.scrollSnapList().length - 1);
        } else {
          api.scrollPrev();
        }
      }
      setCurrent(prev => prev + 1);
    }, 800);
  };

  const stopHoverScroll = () => {
    if (hoverIntervalRef.current) {
      clearInterval(hoverIntervalRef.current);
      hoverIntervalRef.current = null;
    }
  };

  return (
    <div className="w-full py-10 lg:py-16">
      <div className="container mx-auto">
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl md:text-4xl tracking-tight lg:max-w-xl font-serif font-semibold text-foreground text-center mx-auto">
            {title}
          </h2>
          <div ref={containerRef} className="relative">
            {/* Left hover zone */}
            <div 
              className="absolute left-0 top-0 bottom-0 w-[15%] z-10 cursor-w-resize"
              onMouseEnter={() => startHoverScroll('prev')}
              onMouseLeave={stopHoverScroll}
            />
            {/* Right hover zone */}
            <div 
              className="absolute right-0 top-0 bottom-0 w-[15%] z-10 cursor-e-resize"
              onMouseEnter={() => startHoverScroll('next')}
              onMouseLeave={stopHoverScroll}
            />
            <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem className="lg:basis-1/2" key={index}>
                    <div className="bg-muted/30 rounded-lg h-full lg:col-span-2 p-5 flex flex-col gap-3 border border-border/30">
                      <User className="w-6 h-6 stroke-1 text-muted-foreground" />
                      <div className="flex flex-col gap-2">
                        <h3 className="text-lg tracking-tight font-serif font-semibold text-foreground">
                          {testimonial.quote}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {testimonial.description}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Testimonials };
export type { Testimonial, TestimonialsProps };
