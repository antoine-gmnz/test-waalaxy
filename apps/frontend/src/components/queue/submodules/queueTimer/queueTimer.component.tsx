import { useEffect, useRef, useState } from "react"

import { Description, Title } from "../../../../styles/text.style"
import { useQueueContext } from "../../../../context/queue.context"

export const QueueTimer: React.FC = () => {
  const { queue, updateQueue } = useQueueContext();
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isUpdating = useRef<boolean>(false); // To throttle `updateQueue` calls

  const intervalDuration = 15 * 1000; // 15 seconds in milliseconds

  const calculateTimeLeft = () => {
    if (!queue) return intervalDuration;

    const lastExecutionTime = new Date(queue.lastExecutedTime).getTime();
    const currentTime = new Date().getTime();
    const elapsedTime = (currentTime - lastExecutionTime) % intervalDuration;
    const nextExecution = intervalDuration - elapsedTime;

    // Fallback if `lastExecutionTime` is undefined or invalid
    return isNaN(lastExecutionTime)
      ? intervalDuration - (currentTime % intervalDuration)
      : nextExecution;
  };

  const updateCountdown = async () => {
    const countdown = Math.max(0, Math.floor(calculateTimeLeft() / 1000));
    setTimeLeft(countdown);

    if (countdown === 0 && !isUpdating.current) {
      isUpdating.current = true;
      await updateQueue();
      isUpdating.current = false;
    }
  };

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => { if (timerRef.current) clearInterval(timerRef.current) }; // Cleanup on unmount
  }, []);

  return (
    <div>
      <Title>Time until next queue run: {timeLeft}s</Title>
      {queue && <Description>Last action executed at: {new Date(queue.lastExecutedTime).toLocaleString()}</Description>}
    </div>
  );
};
