import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";

import { axiosInstance } from "../../../../utils/axios";
import { API_ROUTES } from "../../../../utils/routes";
import { Action } from "@prisma/client";
import React from "react";
import { ActionContainer, ActionItemText } from "./actionItem.style";


type Props = {
  actionId: string;
}

export const ActionItem = React.memo(({ actionId }: Props) => {
  const [actionData, setActionData] = useState<Action | null>(null);

  useEffect(() => {
    getActionData()
  }, [])

  const getActionData = async () => {
    try {
      const result: AxiosResponse<Action> = await axiosInstance.get(`${API_ROUTES.ACTION_BASE_PATH}${actionId}`)
      setActionData(result.data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <ActionContainer>
      <ActionItemText>{actionData?.name}</ActionItemText>
      <ActionItemText>{actionData?.credits}</ActionItemText>
    </ActionContainer>
  )
})
