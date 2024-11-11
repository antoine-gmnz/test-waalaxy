import { useEffect, useRef, useState } from "react"

import { Card } from "../ui/card.component"
import { Title } from "../ui/title.component"
import { axiosInstance } from "../../utils/axios"
import { API_ROUTES } from "../../utils/routes"
import { AxiosResponse } from "axios"
import { Queue } from "@prisma/client"
import { ActionItem } from "../action/actionItem.component"
import { HorizontalListContainer } from "../../styles/base"

export const QueueTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState<number>(15000);
  const [actionIds, setActionsIds] = useState<string[]>();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchQueueTime = async () => {
    const response: AxiosResponse<Queue> = await axiosInstance.get(API_ROUTES.GET_QUEUE);
    const lastExecutionTime = new Date(response.data.updatedAt).getTime();

    setActionsIds((prev) => {
      // If the actionIds from the response are different from the previous ones, update the state
      if (!prev || JSON.stringify(prev) !== JSON.stringify(response.data.actionIds)) {
        return response.data.actionIds;
      }
      return prev;
    });

    return lastExecutionTime;
  };

  const calculateRemainingTime = (lastExecutionTime: number): number => {
    const now = Date.now();
    const elapsed = now - lastExecutionTime;
    return Math.max(0, 15000 - (elapsed % 15000));
  };

  const syncTimer = async () => {
    try {
      const lastExecutionTime = await fetchQueueTime();
      const remaining = calculateRemainingTime(lastExecutionTime);
      setTimeRemaining(remaining);
    } catch (error) {
      console.error('Failed to fetch queue:', error);
      setTimeRemaining(15000);
    }
  };

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1000) {
          syncTimer();
          return 15000;
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
    syncTimer();
    startTimer();
    return cleanupTimer;
  }, []);

  return (
    <Card>
      <div>
        <Title>Time until next queue run: {Math.ceil(timeRemaining / 1000)}s</Title>
        <HorizontalListContainer>
          {actionIds && actionIds.map((actionId) => (
            <ActionItem key={actionId} actionId={actionId} />
          ))}
        </HorizontalListContainer>
      </div>
    </Card>
  );
};
