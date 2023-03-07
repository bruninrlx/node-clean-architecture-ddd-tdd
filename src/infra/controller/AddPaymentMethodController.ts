import { InternalServerError } from '@/application/errors/errors'
import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import FailView from '../presenters/FailView'
import SuccessView from '../presenters/SuccessView'
import AddPaymentMethod from '@/application/usecase/add-payment-method/AddPaymentMethod'
import { Input } from '@/application/usecase/add-payment-method/Input'
import { Output } from '@/application/usecase/add-payment-method/Output'
import { HttpStatusCode } from '../http/HttpStatusCode'

export default class AddPaymentMethodController {
  constructor(readonly addPaymentMethod: AddPaymentMethod) {}

  async execute(input: Input): Promise<SuccessView<Output> | FailView> {
    try {
      const output = await this.addPaymentMethod.execute(input)
      return new SuccessView(HttpStatusCode.Created, output)
    } catch (error) {
      if (error instanceof Error) return new FailView(HttpStatusCode.InternalServerError, error)
      else
        return new FailView(
          HttpStatusCode.InternalServerError,
          new InternalServerError('ServerError')
        )
    }
  }
}
