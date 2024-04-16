import { regexValidate } from './regex-validate'
import { roleAuth } from './role-auth'
import { privateStatus, projectType } from './others'

const VARIABLE = {
  ...regexValidate,
  ...roleAuth,
  ...privateStatus,
  ...projectType,
}

export default VARIABLE
