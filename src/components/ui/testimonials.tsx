"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Testimonial {
  quote: string;
  description: string;
  author: string;
  initials: string;
  avatar?: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
  title?: string;
}

function Testimonials({ testimonials, title = "What people say when they see it" }: TestimonialsProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

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

  return (
    <div className="w-full py-20 lg:py-32">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <h2 className="text-3xl md:text-4xl tracking-tight lg:max-w-xl font-serif text-foreground text-center mx-auto">
            {title}
          </h2>
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem className="lg:basis-1/2" key={index}>
                  <div className="bg-muted/30 rounded-lg h-full lg:col-span-2 p-6 aspect-video flex justify-between flex-col border border-border/30">
                    <User className="w-8 h-8 stroke-1 text-muted-foreground" />
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col">
                        <h3 className="text-xl tracking-tight font-serif text-foreground">
                          {testimonial.quote}
                        </h3>
                        <p className="text-muted-foreground max-w-xs text-base leading-relaxed">
                          {testimonial.description}
                        </p>
                      </div>
                      <p className="flex flex-row gap-2 text-sm items-center text-muted-foreground">
                        <span className="text-foreground/70">By</span>
                        <Avatar className="h-6 w-6">
                          {testimonial.avatar && <AvatarImage src={testimonial.avatar} />}
                          <AvatarFallback className="text-xs bg-accent/20 text-accent-foreground">
                            {testimonial.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span>{testimonial.author}</span>
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
  );
}

export { Testimonials };
export type { Testimonial, TestimonialsProps };
