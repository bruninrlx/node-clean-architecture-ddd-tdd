import { InternalServerError } from '@/application/errors/errors'
import FailView from '../presenters/FailView'
import SuccessView from '../presenters/SuccessView'
import GetPaymentMethods from '@/application/usecase/get-payment-methods/GetPaymentMethods'
import { Output } from '@/application/usecase/get-payment-methods/Output'
import { HttpStatusCode } from '../http/HttpStatusCode'

export default class GetPaymentMethodsController {
  constructor(readonly getPaymentMethods: GetPaymentMethods) {}

  async execute(ownerCode: string): Promise<SuccessView<Output> | FailView> {
    try {
      const output = await this.getPaymentMethods.execute(ownerCode)
      return new SuccessView(HttpStatusCode.OK, output)
    } catch (error) {
      if (error instanceof Error) return new FailView(HttpStatusCode.NotFound, error)
      else
        return new FailView(
          HttpStatusCode.InternalServerError,
          new InternalServerError('ServerError')
        )
    }
  }
}
