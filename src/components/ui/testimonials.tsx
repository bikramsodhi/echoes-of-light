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

  useEffect(() => {
    if (!api) {
      return;
    }

    const interval = setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0);
        api.scrollTo(0);
      } else {
        api.scrollNext();
        setCurrent(current + 1);
      }
    }, 4000);

    return () => clearTimeout(interval);
  }, [api, current]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !api) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    // Left 20% scrolls prev, right 20% scrolls next
    if (x < width * 0.2) {
      containerRef.current.style.cursor = 'w-resize';
    } else if (x > width * 0.8) {
      containerRef.current.style.cursor = 'e-resize';
    } else {
      containerRef.current.style.cursor = 'default';
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !api) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    if (x < width * 0.2) {
      api.scrollPrev();
      setCurrent(Math.max(0, current - 1));
    } else if (x > width * 0.8) {
      api.scrollNext();
      setCurrent(current + 1);
    }
  };

  return (
    <div className="w-full py-10 lg:py-16">
      <div className="container mx-auto">
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl md:text-4xl tracking-tight lg:max-w-xl font-serif font-semibold text-foreground text-center mx-auto">
            {title}
          </h2>
          <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onClick={handleClick}
            className="relative"
          >
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem className="lg:basis-1/2" key={index}>
                    <div className="bg-muted/30 rounded-lg h-full lg:col-span-2 p-5 flex flex-col gap-3 border border-border/30">
                      <User className="w-6 h-6 stroke-1 text-muted-foreground" />
                      <div className="flex flex-col gap-2">
                        <h3 className="text-lg tracking-tight font-serif text-foreground">
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
