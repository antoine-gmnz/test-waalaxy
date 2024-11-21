import { Card } from "../ui/card/card.component"
import { HorizontalListContainer } from "../../styles/base"
import { CreateActionItem } from "./submodules/createActionItem/createActionItem.component"
import { Description, Title } from "../../styles/text.style"
import { useQueueContext } from "../../context/queue.context"

export const CreateNewAction = () => {
  const { actionItems } = useQueueContext();

  return (
    <Card>
      <Title>Add new action to Queue</Title>
      <Description>Click on an action to add it !</Description>
      <HorizontalListContainer>
        {actionItems.map((actionItem) => (
          <CreateActionItem key={actionItem.id} {...actionItem} />
        ))}
      </HorizontalListContainer>
    </Card >
  )
}
