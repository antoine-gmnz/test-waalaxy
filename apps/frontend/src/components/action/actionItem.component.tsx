import { useEffect, useState } from "react";
import styled from "styled-components";
import { AxiosResponse } from "axios";

import { axiosInstance } from "../../utils/axios";
import { API_ROUTES } from "../../utils/routes";
import { Action } from "@prisma/client";

const ActionContainer = styled.div`
  height: 25px;
  width: 25px;

  border: 1px solid ${props => props.theme.darkerBlue};
  border-radius: 5px;

  display: flex;
  align-items: center;
  justify-content: center;
`

type Props = {
  actionId: string;
}

export const ActionItem = ({ actionId }: Props) => {
  const [actionData, setActionData] = useState<Action | null>(null);

  useEffect(() => {
    getActionData()
  }, [])

  const getActionData = async () => {
    try {
      const result: AxiosResponse<Action> = await axiosInstance.get(`${API_ROUTES.GET_ACTION}${actionId}`)
      setActionData(result.data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <ActionContainer>{actionData?.name}</ActionContainer>
  )
}
