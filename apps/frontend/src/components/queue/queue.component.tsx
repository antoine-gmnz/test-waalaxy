import { QueueTimer } from "./submodules/queueTimer/queueTimer.component"
import { Card } from "../ui/card/card.component"
import { HorizontalListContainer } from "../../styles/base"
import { useQueueContext } from "../../context/queue.context";
import { ActionItem } from "./submodules/actionItem/actionItem.component";

export const Queue = () => {
  const { queue } = useQueueContext();

  return (
    <Card>
      <div>
        {queue && <QueueTimer />}
        <HorizontalListContainer>
          {queue?.actionIds && queue.actionIds.map((actionId) => (
            <ActionItem key={actionId} actionId={actionId} />
          ))}
        </HorizontalListContainer>
      </div>
    </Card>
  )
}
