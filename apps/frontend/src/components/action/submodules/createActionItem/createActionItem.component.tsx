import { ActionType } from "@prisma/client"

import { CreateActionItemContainer } from "./createActionItem.style"
import { useCreateAction } from "../../../../hooks/useCreateAction.hook"
import { useQueueContext } from "../../../../context/queue.context"
import { FlexCenterCol } from "../../../../styles/base"

type Props = ActionType

export const CreateActionItem = ({ name, id, credits }: Props) => {
    const { updateQueue } = useQueueContext();

    const { createAction } = useCreateAction();

    const callback = async () => {
        await createAction({ name, actionTypeId: id })
        updateQueue()
    }

    return (
        <CreateActionItemContainer onClick={callback}>
            <FlexCenterCol>
                <div>{name}</div>
                <div>{credits}</div>
            </FlexCenterCol>
        </CreateActionItemContainer>
    )
}
