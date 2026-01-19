"use client";

import { useEffect, useRef, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import { User } from "lucide-react";

interface Testimonial {
  quote: string;
  description: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
  title?: string;
}

const DRIFT_SPEED = 1.125; // px per frame (gentle continuous drift)

function Testimonials({
  testimonials,
  title = "What people say when they see it",
}: TestimonialsProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [tick, setTick] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const hoverDirectionRef = useRef<"forward" | "backward" | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);

    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  // Auto-advance (disabled while hovering or if reduced motion)
  useEffect(() => {
    if (!api || reducedMotion || isHovering) return;

    const t = window.setTimeout(() => {
      api.scrollNext();
      setTick((v) => v + 1);
    }, 4000);

    return () => window.clearTimeout(t);
  }, [api, reducedMotion, isHovering, tick]);

  const ensureAutoScrollPlugin = (direction: "forward" | "backward") => {
    if (!api) return;

    // Only re-init when direction changes (re-init is expensive)
    if (hoverDirectionRef.current === direction && (api as any).plugins?.()?.autoScroll) {
      return;
    }

    hoverDirectionRef.current = direction;

    // Re-init with AutoScroll for stable continuous movement
    api.reInit(
      { loop: true },
      [
        AutoScroll({
          playOnInit: false,
          startDelay: 0,
          speed: DRIFT_SPEED,
          direction,
          stopOnInteraction: false,
          stopOnFocusIn: true,
        }),
      ],
    );
  };

  const startHoverDrift = (direction: "forward" | "backward") => {
    if (!api || reducedMotion) return;

    setIsHovering(true);
    ensureAutoScrollPlugin(direction);

    // Start immediately (no delay)
    window.setTimeout(() => {
      const autoScroll = (api as any).plugins?.()?.autoScroll;
      autoScroll?.play?.(0);
    }, 0);
  };

  const stopHoverDrift = () => {
    if (!api) return;

    setIsHovering(false);

    const autoScroll = (api as any).plugins?.()?.autoScroll;
    autoScroll?.stop?.();

    // Settle gently to the closest snap point for readability
    api.scrollTo(api.selectedScrollSnap());
  };

  return (
    <div className="w-full py-10 lg:py-16">
      <div className="container mx-auto">
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl md:text-4xl tracking-tight lg:max-w-xl font-serif font-semibold text-foreground text-center mx-auto">
            {title}
          </h2>

          <div className="relative">
            {/* Left hover zone */}
            <div
              className="absolute left-0 top-0 bottom-0 w-[15%] z-10 cursor-w-resize"
              onMouseEnter={() => startHoverDrift("backward")}
              onMouseLeave={stopHoverDrift}
              aria-hidden="true"
            />

            {/* Right hover zone */}
            <div
              className="absolute right-0 top-0 bottom-0 w-[15%] z-10 cursor-e-resize"
              onMouseEnter={() => startHoverDrift("forward")}
              onMouseLeave={stopHoverDrift}
              aria-hidden="true"
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

