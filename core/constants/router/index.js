import { userRouter } from './user'
import { adminRouter } from './admin'

const ROUTER = {
  ...userRouter,
  ...adminRouter,
}

export default ROUTER
