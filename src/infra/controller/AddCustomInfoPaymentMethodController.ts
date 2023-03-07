import { InternalServerError } from '@/application/errors/errors'
import AddCustomInfoCustomPaymentMethod from '@/application/usecase/add-custom-info-custom-payment-method/AddCustomInfoCustomPaymentMethod'
import { Input } from '@/application/usecase/add-custom-info-custom-payment-method/Input'
import { Output } from '@/application/usecase/add-custom-info-custom-payment-method/Output'
import { HttpStatusCode } from '../http/HttpStatusCode'
import FailView from '../presenters/FailView'
import SuccessView from '../presenters/SuccessView'

export default class AddCustomInfoCustomPaymentMethodController {
  constructor(readonly addCustomInfoCustomPaymentMethod: AddCustomInfoCustomPaymentMethod) {}

  async execute(input: Input): Promise<SuccessView<Output> | FailView> {
    try {
      const output = await this.addCustomInfoCustomPaymentMethod.execute(input)
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
