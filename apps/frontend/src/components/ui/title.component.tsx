import { PropsWithChildren } from "react"
import styled from "styled-components"

const TitleContainer = styled.p`
  font-size: 22px;
  font-weight: bold;
`

export const Title = ({ children }: PropsWithChildren) => {
  return (
    <TitleContainer>{children}</TitleContainer>
  )
}
