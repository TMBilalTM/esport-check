'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
  onComplete?: () => void;
  compact?: boolean;
}

interface TimeUnit {
  value: number;
  label: string;
  shortLabel: string;
}

export function CountdownTimer({
  targetDate,
  className,
  onComplete,
  compact = false,
}: CountdownTimerProps) {
  const [mounted, setMounted] = useState(false);
  
  const calculateTimeLeft = useCallback(() => {
    const difference = targetDate.getTime() - Date.now();

    if (difference <= 0) {
      return [];
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    const units: TimeUnit[] = [];

    if (days > 0) {
      units.push({ value: days, label: 'days', shortLabel: 'd' });
    }
    units.push({ value: hours, label: 'hours', shortLabel: 'h' });
    units.push({ value: minutes, label: 'minutes', shortLabel: 'm' });
    units.push({ value: seconds, label: 'seconds', shortLabel: 's' });

    return units;
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState<TimeUnit[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft());
  }, [calculateTimeLeft]);

  useEffect(() => {
    if (!mounted) return;
    
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      if (newTimeLeft.length === 0 && !isComplete) {
        setIsComplete(true);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft, isComplete, onComplete, mounted]);

  if (!mounted) {
    return (
      <div className={cn('flex items-center gap-1 font-mono text-sm', className)}>
        <span className="text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className={cn('text-center', className)}>
        <span className="text-sm font-medium text-muted-foreground">Starting soon...</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={cn('flex items-center gap-1 font-mono text-sm', className)}>
        {timeLeft.map((unit, index) => (
          <span key={unit.label} className="flex items-center">
            <motion.span
              key={`${unit.label}-${unit.value}`}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="tabular-nums"
            >
              {String(unit.value).padStart(2, '0')}
            </motion.span>
            <span className="text-muted-foreground">{unit.shortLabel}</span>
            {index < timeLeft.length - 1 && <span className="mx-0.5 text-muted-foreground">:</span>}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {timeLeft.map((unit, index) => (
        <div key={unit.label} className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-secondary/50 backdrop-blur-sm border border-white/5">
                <motion.span
                  key={`${unit.label}-${unit.value}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-2xl font-bold tabular-nums"
                >
                  {String(unit.value).padStart(2, '0')}
                </motion.span>
              </div>
            </div>
            <span className="mt-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
              {unit.label}
            </span>
          </div>
          {index < timeLeft.length - 1 && (
            <span className="text-2xl font-light text-muted-foreground/50 -mt-5">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

interface MatchTimerProps {
  startTime: Date;
  className?: string;
}

export function MatchTimer({ startTime, className }: MatchTimerProps) {
  const [mounted, setMounted] = useState(false);
  
  const calculateElapsed = useCallback(() => {
    const diff = Date.now() - startTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }, [startTime]);

  const [elapsed, setElapsed] = useState('0:00');

  useEffect(() => {
    setMounted(true);
    setElapsed(calculateElapsed());
  }, [calculateElapsed]);

  useEffect(() => {
    if (!mounted) return;
    
    const timer = setInterval(() => {
      setElapsed(calculateElapsed());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateElapsed, mounted]);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
      </div>
      <span className="font-mono text-sm tabular-nums text-muted-foreground">{elapsed}</span>
    </div>
  );
}
