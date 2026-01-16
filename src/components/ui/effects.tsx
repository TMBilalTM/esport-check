'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextShimmerProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

export function TextShimmer({ children, className, duration = 2 }: TextShimmerProps) {
  return (
    <span
      className={cn(
        'relative inline-block bg-clip-text text-transparent',
        'bg-[length:200%_100%]',
        'animate-shimmer',
        className
      )}
      style={{
        backgroundImage: 'linear-gradient(90deg, #fafafa 0%, #71717a 50%, #fafafa 100%)',
        animationDuration: `${duration}s`,
      }}
    >
      {children}
    </span>
  );
}

interface SpotlightProps {
  className?: string;
  fill?: string;
}

export function Spotlight({ className, fill = 'white' }: SpotlightProps) {
  return (
    <svg
      className={cn(
        'pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%] opacity-[0.03]',
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#filter)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill}
          fillOpacity="0.21"
        />
      </g>
      <defs>
        <filter
          id="filter"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur_1065_8" />
        </filter>
      </defs>
    </svg>
  );
}

interface GlowEffectProps {
  children: React.ReactNode;
  className?: string;
  glowClassName?: string;
}

export function GlowEffect({ children, className, glowClassName }: GlowEffectProps) {
  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'absolute -inset-px rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100',
          glowClassName
        )}
      />
      {children}
    </div>
  );
}

interface AnimatedBorderProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  clockwise?: boolean;
}

export function AnimatedBorder({
  children,
  className,
  containerClassName,
  borderClassName,
  duration = 4,
  clockwise = true,
}: AnimatedBorderProps) {
  return (
    <div className={cn('relative p-[1px] overflow-hidden rounded-xl', containerClassName)}>
      <motion.div
        className={cn(
          'absolute inset-0',
          'bg-[conic-gradient(from_90deg_at_50%_50%,#27272a_0%,#fafafa_10%,#27272a_20%)]',
          borderClassName
        )}
        animate={{
          rotate: clockwise ? 360 : -360,
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <div className={cn('relative bg-card rounded-[11px]', className)}>{children}</div>
    </div>
  );
}

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.5,
  direction = 'up',
}: FadeInProps) {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
    none: {},
  };

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerChildren = 0.1,
  delayChildren = 0,
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren,
            delayChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.21, 0.47, 0.32, 0.98],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

interface NumberTickerProps {
  value: number;
  className?: string;
  decimalPlaces?: number;
}

export function NumberTicker({ value, className, decimalPlaces = 0 }: NumberTickerProps) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      {value.toFixed(decimalPlaces)}
    </motion.span>
  );
}

interface LiveIndicatorProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function LiveIndicator({ className, size = 'md', showText = true }: LiveIndicatorProps) {
  const sizes = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-2.5 w-2.5',
  };

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <span className="relative flex">
        <span
          className={cn(
            'absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75',
            sizes[size]
          )}
        />
        <span className={cn('relative inline-flex rounded-full bg-red-500', sizes[size])} />
      </span>
      {showText && (
        <span className="text-xs font-medium uppercase tracking-wider text-red-500">Live</span>
      )}
    </div>
  );
}
