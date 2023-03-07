import { InternalServerError } from '@/application/errors/errors'
import AddCustomDocument from '@/application/usecase/add-custom-document/AddCustomDocument'
import { Input } from '@/application/usecase/add-custom-document/Input'
import { Output } from '@/application/usecase/add-custom-document/Output'
import { HttpStatusCode } from '../http/HttpStatusCode'
import FailView from '../presenters/FailView'
import SuccessView from '../presenters/SuccessView'

export default class AddCustomDocumentController {
  constructor(readonly addCustomDocument: AddCustomDocument) {}

  async execute(input: Input): Promise<SuccessView<Output> | FailView> {
    try {
      const output = await this.addCustomDocument.execute(input)
      return new SuccessView(HttpStatusCode.Created, output)
    } catch (error) {
      if (error instanceof Error) return new FailView(HttpStatusCode.BadRequest, error)
      else
        return new FailView(
          HttpStatusCode.InternalServerError,
          new InternalServerError('ServerError')
        )
    }
  }
}
