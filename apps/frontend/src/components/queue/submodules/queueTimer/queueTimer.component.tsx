import { useEffect, useRef, useState } from "react"

import { Description, Title } from "../../../../styles/text.style"
import { useQueue } from "../../../../context/queue.context"

const DEFAULT_TIMER = 15000

export const QueueTimer = () => {
  const { queue, fetchQueue } = useQueue();
  const [timeRemaining, setTimeRemaining] = useState<number>(DEFAULT_TIMER);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const calculateRemainingTime = (lastExecutionTime: number): number => {
    const now = Date.now();
    const elapsed = now - lastExecutionTime;
    return Math.max(0, DEFAULT_TIMER - (elapsed % DEFAULT_TIMER));
  };

  const syncTimer = async () => {
    try {
      if (!queue?.lastExecutedTime) {
        setTimeRemaining(DEFAULT_TIMER)
        return
      }

      fetchQueue()

      const lastExecutionTime = new Date(queue.lastExecutedTime).getTime();
      const remaining = calculateRemainingTime(lastExecutionTime);
      setTimeRemaining(remaining);
    } catch (error) {
      console.error('Failed to fetch queue:', error);
      setTimeRemaining(DEFAULT_TIMER);
    }
  };

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1000) {
          syncTimer();
          return DEFAULT_TIMER;
        }
        return prev - 1000;
      });
    }, 1000);
  };

  const cleanupTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (queue) {
      syncTimer();
      startTimer();
    }
    return cleanupTimer;
  }, []);

  return (
    <div>
      <Title>Time until next queue run: {Math.ceil(timeRemaining / 1000)}s</Title>
      {queue && <Description>Last action executed at: {new Date(queue.lastExecutedTime).toLocaleString()}</Description>}
    </div>
  );
};
