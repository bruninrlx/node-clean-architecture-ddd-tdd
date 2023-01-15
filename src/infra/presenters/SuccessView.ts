import { NotFoundError, UnauthorizedError } from '@/application/errors/errors'

export default class SuccessView {
  constructor(readonly status: number, readonly response: any) {}
}
