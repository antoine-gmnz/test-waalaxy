import { useEffect, useState, memo } from "react";
import { Action } from "@prisma/client";
import { ActionContainer, ActionItemText } from "./actionItem.style";
import { useQueueContext } from "../../../../context/queue.context";
import { useGetActionData } from "../../../../hooks/useGetActionData.hook";


type Props = {
  actionId: string;
}

export const ActionItem = memo(({ actionId }: Props) => {
  const { queue } = useQueueContext();
  const { fetchActionData } = useGetActionData();
  const [actionData, setActionData] = useState<Action | null>(null);

  useEffect(() => {
    getActionData()
  }, [queue])

  const getActionData = async () => {
    try {
      const result = await fetchActionData(actionId)
      if (result) {
        setActionData(result)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <ActionContainer>
      <ActionItemText>{actionData?.name}</ActionItemText>
    </ActionContainer>
  )
})
