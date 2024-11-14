import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

import { API_ROUTES } from "../utils/routes";
import { axiosInstance } from "../utils/axios";
import { Queue } from "@prisma/client";
import { AxiosResponse } from "axios";

export type QueueContextType = {
  fetchQueue: () => void;
  queue: Queue | null;
}

const QueueContext = createContext<QueueContextType | null>(null);

export const QueueProvider = ({ children }: PropsWithChildren) => {
  const [queue, setQueue] = useState<Queue | null>(null);

  const fetchQueue = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Queue> = await axiosInstance.get(API_ROUTES.GET_QUEUE);
      setQueue(response.data)
    } catch (error) {
      console.error('Failed to fetch queue:', error);
    }
  };

  useEffect(() => {
    if (!queue) {
      fetchQueue()
    }
  }, [])

  // We make sure the queue has been fetched before rendering the children, avoid desync
  return (
    <QueueContext.Provider value={{ fetchQueue, queue }}>
      {queue && children}
    </QueueContext.Provider>
  )
}

// Custom hook to access the queue context
export const useQueue = () => {
  const context = useContext(QueueContext);
  if (context === null) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};

