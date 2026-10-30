import type { ReactNode } from 'react'
import {Alert} from 'react-bootstrap'

const Message = ({variant = 'info', children}: {variant?: string, children: ReactNode}) => {
  return (
    <Alert variant={variant}>
        {children}
    </Alert>
  )
}

export default Message
