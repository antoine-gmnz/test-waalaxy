import { PropsWithChildren } from "react"
import styled from "styled-components"

const CardContainer = styled.div`
  background: ${props => props.theme.white};
  padding: 20px;
  height: auto;
  min-width: 35%;
  color: ${props => props.theme.darkerBlue};
  border-radius: 10px;
`

export const Card = ({ children }: PropsWithChildren) => {
  return (
    <CardContainer>{children}</CardContainer>
  )
}
