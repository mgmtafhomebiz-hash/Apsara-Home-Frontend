import type { HTMLAttributes, ReactNode } from "react";

type CarouselProps = HTMLAttributes<HTMLDivElement> & {
  opts?: unknown;
  plugins?: unknown[];
};

type CarouselContentProps = HTMLAttributes<HTMLDivElement>;
type CarouselItemProps = HTMLAttributes<HTMLDivElement>;

export function Carousel({ className = "", children, ...props }: CarouselProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export function CarouselContent({
  className = "",
  children,
  ...props
}: CarouselContentProps) {
  return (
    <div className={`flex flex-wrap justify-center gap-8 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function CarouselItem({ className = "", children, ...props }: CarouselItemProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export function CarouselNext(_props: { children?: ReactNode }) {
  void _props;
  return null;
}

export function CarouselPrevious(_props: { children?: ReactNode }) {
  void _props;
  return null;
}
