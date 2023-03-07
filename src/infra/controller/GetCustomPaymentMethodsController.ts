import { InternalServerError } from '@/application/errors/errors'
import FailView from '../presenters/FailView'
import SuccessView from '../presenters/SuccessView'
import { Output } from '@/application/usecase/get-custom-documents/Output'
import GetCustomPaymentMethods from '@/application/usecase/get-custom-payment-methods/GetCustomPaymentMethods'
import { HttpStatusCode } from '../http/HttpStatusCode'

export default class GetCustomPaymentMethodController {
  constructor(readonly getCustomDocuments: GetCustomPaymentMethods) {}

  async execute(ownerCode: string): Promise<SuccessView<Output> | FailView> {
    try {
      const output = await this.getCustomDocuments.execute(ownerCode)
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
