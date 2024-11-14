import { QueueTimer } from "./submodules/queueTimer/queueTimer.component"
import { Card } from "../ui/card/card.component"
import { HorizontalListContainer } from "../../styles/base"
import { useQueue } from "../../context/queue.context";
import { ActionItem } from "./submodules/actionItem/actionItem.component";

export const Queue = () => {
  const { queue } = useQueue();

  return (
    <Card>
      <div>
        <QueueTimer />
        <HorizontalListContainer>
          {queue?.actionIds && queue.actionIds.map((actionId) => (
            <ActionItem key={actionId} actionId={actionId} />
          ))}
        </HorizontalListContainer>
      </div>
    </Card>
  )
}
