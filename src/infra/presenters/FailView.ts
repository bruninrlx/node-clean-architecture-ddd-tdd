import { InternalServerError, NotFoundError, UnauthorizedError } from '@/application/errors/errors'

export default class FailView {
  constructor(
    readonly status: number,
    readonly responseError: NotFoundError | UnauthorizedError | InternalServerError
  ) {}
}
