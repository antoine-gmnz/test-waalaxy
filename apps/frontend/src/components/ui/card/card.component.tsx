import { CardContainer } from "./card.styles"
import { PropsWithChildren } from "react"

export const Card = ({ children }: PropsWithChildren) => {
  return (
    <CardContainer>{children}</CardContainer>
  )
}
