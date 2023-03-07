import { InternalServerError } from '@/application/errors/errors'
import AddCustomInfoCustomDocument from '@/application/usecase/add-custom-info-custom-document/AddCustomInfoCustomDocument'
import { Input } from '@/application/usecase/add-custom-info-custom-document/Input'
import { Output } from '@/application/usecase/add-custom-info-custom-document/Output'
import { HttpStatusCode } from '../http/HttpStatusCode'
import FailView from '../presenters/FailView'
import SuccessView from '../presenters/SuccessView'

export default class AddCustomInfoCustomDocumentController {
  constructor(readonly addCustomInfoDocument: AddCustomInfoCustomDocument) {}

  async execute(input: Input): Promise<SuccessView<Output> | FailView> {
    try {
      const output = await this.addCustomInfoDocument.execute(input)
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
