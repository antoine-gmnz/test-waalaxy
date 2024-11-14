import { useEffect, useState } from "react"
import { ActionType } from "@prisma/client"
import { AxiosResponse } from "axios"

import { Card } from "../ui/card/card.component"
import { HorizontalListContainer } from "../../styles/base"
import { axiosInstance } from "../../utils/axios"
import { API_ROUTES } from "../../utils/routes"
import { CreateActionItem } from "./submodules/createActionItem/createActionItem.component"
import { Description, Title } from "../../styles/text.style"

export const CreateNewAction = () => {
  const [actionTypes, setAllActionTypess] = useState<ActionType[]>([])

  useEffect(() => {
    getAllActionTypes()
  }, [])

  const getAllActionTypes = async () => {
    try {
      const result: AxiosResponse<ActionType[]> = await axiosInstance.get(API_ROUTES.ACTION_TYPE_BASE_PATH)
      setAllActionTypess(result.data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Card>
      <Title>Add new action to Queue</Title>
      <Description>Click on an action to add it !</Description>
      <HorizontalListContainer>
        {actionTypes.map((actionType) => (
          <CreateActionItem key={actionType.id} {...actionType} />
        ))}
      </HorizontalListContainer>
    </Card >
  )
}
