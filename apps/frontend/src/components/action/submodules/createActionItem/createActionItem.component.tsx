import { ActionType } from "@prisma/client"

import { axiosInstance } from "../../../../utils/axios"
import { API_ROUTES } from "../../../../utils/routes"
import { useQueue } from "../../../../context/queue.context"
import { CreateActionItemContainer } from "./createActionItem.style"

type Props = ActionType

export const CreateActionItem = ({ name, id }: Props) => {
  const { fetchQueue } = useQueue()

  const createAction = async (): Promise<void> => {
    try {
      const response = await axiosInstance.post(API_ROUTES.ACTION_BASE_PATH, {
        name, actionTypeId: id
      })

      if (response.data) {
        fetchQueue()
      }

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <CreateActionItemContainer>
      <div onClick={createAction}>{name}</div>
    </CreateActionItemContainer>
  )
}
