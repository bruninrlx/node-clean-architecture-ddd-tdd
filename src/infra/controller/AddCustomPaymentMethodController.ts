import { InternalServerError } from '@/application/errors/errors'
import AddCustomPaymentMethod from '@/application/usecase/add-custom-payment-method/AddCustomPaymentMethod'
import { Output } from '@/application/usecase/add-custom-payment-method/Output'
import { Input } from '@/application/usecase/add-custom-payment-method/Input'
import FailView from '../presenters/FailView'
import SuccessView from '../presenters/SuccessView'
import { HttpStatusCode } from '../http/HttpStatusCode'

export default class AddCustomPaymentMethodController {
  constructor(readonly addCustomPaymentMethod: AddCustomPaymentMethod) {}

  async execute(input: Input): Promise<SuccessView<Output> | FailView> {
    try {
      const output = await this.addCustomPaymentMethod.execute(input)
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
