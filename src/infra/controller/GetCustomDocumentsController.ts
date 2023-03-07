import { InternalServerError } from '@/application/errors/errors'
import FailView from '../presenters/FailView'
import SuccessView from '../presenters/SuccessView'
import GetCustomDocuments from '@/application/usecase/get-custom-documents/GetCustomDocuments'
import { Output } from '@/application/usecase/get-custom-documents/Output'
import { HttpStatusCode } from '../http/HttpStatusCode'

export default class GetCustomDocumentsController {
  constructor(readonly getCustomDocuments: GetCustomDocuments) {}

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
