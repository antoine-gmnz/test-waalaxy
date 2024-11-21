import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { ActionType, Queue } from "@prisma/client";

import { useQueue } from "../hooks/useQueue";
import { useFetchActionTypes } from "../hooks/useGetAllActionTypes";

export type QueueContextType = {
  updateQueue: () => Promise<void>;
  queue: Queue | null;
  actionItems: ActionType[]
  loading: boolean;
}

const QueueContext = createContext<QueueContextType | null>(null);

export const QueueProvider = ({ children }: PropsWithChildren) => {
  const [queue, setQueue] = useState<Queue | null>(null);
  const [actionItems, setActionItems] = useState<ActionType[]>([]);

  const { fetchQueue, loading } = useQueue()
  const { fetchActionTypes } = useFetchActionTypes();

  const updateQueue = async (): Promise<void> => {
    const response = await fetchQueue()
    if (response) setQueue({ ...queue, ...response })
    await getActionTypes()
  };

  const getActionTypes = async () => {
    const actionTypes = await fetchActionTypes()
    if (actionTypes)
      setActionItems(actionTypes)
  }

  useEffect(() => {
    if (!queue) {
      updateQueue()
      getActionTypes()
    }
  }, [queue])

  // We make sure the queue has been fetched before rendering the children, avoid desync
  return (
    <QueueContext.Provider value={{ updateQueue, queue, loading, actionItems }}>
      {children}
    </QueueContext.Provider>
  )
}

// Custom hook to access the queue context
export const useQueueContext = () => {
  const context = useContext(QueueContext);
  if (context === null) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};

