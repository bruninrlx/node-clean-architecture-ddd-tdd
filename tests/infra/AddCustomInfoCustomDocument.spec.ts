import { Input } from '@/application/usecase/add-custom-info-custom-document/Input'
import AddCustomInfoCustomDocumentController from '@/infra/controller/AddCustomInfoCustomDocumentController'
import { mock, MockProxy } from 'jest-mock-extended'
import SuccessView from '@/infra/presenters/SuccessView'
import { HttpStatusCode } from '@/infra/http/HttpStatusCode'
import { BadRequestError } from '@/application/errors/errors'
import FailView from '@/infra/presenters/FailView'
import AddCustomInfoCustomDocument from '@/application/usecase/add-custom-info-custom-document/AddCustomInfoCustomDocument'
import CustomInfo from '@/domain/entity/CustomInfo'

describe('AddCustomInfoCustomDocumentController', () => {
  let input: Input
  let addCustomInfoCustomDocument: MockProxy<AddCustomInfoCustomDocument>
  let sut: AddCustomInfoCustomDocumentController

  beforeEach(async () => {
    addCustomInfoCustomDocument = mock()
    input = {
      ownerCode: 'owner_code',
      customDocumentName: 'custom_document_name',
      description: 'description',
      customInfo: {
        title: 'title',
        info: 'info',
        description: 'description',
      },
    }
    sut = new AddCustomInfoCustomDocumentController(addCustomInfoCustomDocument)
  })

  it('should return a SuccessView with the correct status code and output data on success', async () => {
    const customInfo = new CustomInfo('title', 'info', 'description')
    addCustomInfoCustomDocument.execute.mockReturnValue(Promise.resolve(customInfo))
    const output = await sut.execute(input)
    const successView = new SuccessView(HttpStatusCode.Created, customInfo)
    expect(output).toEqual(successView)
  })

  it('should return a FailView with the correct status code and error data', async () => {
    const unauthorizedError = new BadRequestError(
      'Error when tries to save an custom info to an custom document'
    )
    addCustomInfoCustomDocument.execute.mockRejectedValue(unauthorizedError)
    const output = await sut.execute(input)
    const failView = new FailView(HttpStatusCode.InternalServerError, unauthorizedError)
    expect(output).toEqual(failView)
  })
})
