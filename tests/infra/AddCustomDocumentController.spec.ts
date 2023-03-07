import AddCustomDocument from '@/application/usecase/add-custom-document/AddCustomDocument'
import { Input } from '@/application/usecase/add-custom-document/Input'
import AddCustomDocumentController from '@/infra/controller/AddCustomDocumentController'
import { mock, MockProxy } from 'jest-mock-extended'
import SuccessView from '@/infra/presenters/SuccessView'
import { HttpStatusCode } from '@/infra/http/HttpStatusCode'
import { BadRequestError } from '@/application/errors/errors'
import FailView from '@/infra/presenters/FailView'
import CustomDocument from '@/domain/entity/CustomDocument'

describe('AddCustomDocumentController', () => {
  let input: Input
  let addCustomDocument: MockProxy<AddCustomDocument>
  let sut: AddCustomDocumentController

  beforeEach(async () => {
    addCustomDocument = mock()
    input = {
      ownerCode: 'any_owner_code',
      customDocumentName: 'any_custom_document',
      description: 'any_description',
    }
    sut = new AddCustomDocumentController(addCustomDocument)
  })

  it('should return a SuccessView with the correct status code and output data on success', async () => {
    const customDocument = new CustomDocument(
      'any_custom_document_name',
      'any_custom_document_description'
    )
    addCustomDocument.execute.mockReturnValue(Promise.resolve(customDocument))
    const output = await sut.execute(input)
    const successView = new SuccessView(HttpStatusCode.Created, customDocument)
    expect(output).toEqual(successView)
  })

  it('should return a FailView with the correct status code and error data', async () => {
    const unauthorizedError = new BadRequestError('Error when tries to save an custom document')
    addCustomDocument.execute.mockRejectedValue(unauthorizedError)
    const output = await sut.execute(input)
    const failView = new FailView(HttpStatusCode.BadRequest, unauthorizedError)
    expect(output).toEqual(failView)
  })
})
