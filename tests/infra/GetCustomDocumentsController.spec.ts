import { mock, MockProxy } from 'jest-mock-extended'
import SuccessView from '@/infra/presenters/SuccessView'
import { HttpStatusCode } from '@/infra/http/HttpStatusCode'
import { BadRequestError } from '@/application/errors/errors'
import FailView from '@/infra/presenters/FailView'
import CustomDocument from '@/domain/entity/CustomDocument'
import GetCustomDocumentsController from '@/infra/controller/GetCustomDocumentsController'
import GetCustomDocuments from '@/application/usecase/get-custom-documents/GetCustomDocuments'
import CustomInfo from '@/domain/entity/CustomInfo'

describe('GetCustomDocumentsController', () => {
  let getCustomDocuments: MockProxy<GetCustomDocuments>
  let sut: GetCustomDocumentsController
  let ownerCode: string

  beforeEach(async () => {
    getCustomDocuments = mock()
    ownerCode = 'any_owner_code'
    sut = new GetCustomDocumentsController(getCustomDocuments)
  })

  it('should return a SuccessView with the correct status code and output data on success', async () => {
    const customDocument = new CustomDocument(
      'any_custom_document_name',
      'any_custom_document_description'
    )
    const secondCustomDocument = new CustomDocument(
      'any_custom_document_name',
      'any_custom_document_description'
    )
    customDocument.addCustomInfo(new CustomInfo('any_title', 'any_info', 'any_description'))
    getCustomDocuments.execute.mockReturnValue(
      Promise.resolve([customDocument, secondCustomDocument])
    )
    const output = await sut.execute(ownerCode)
    const successView = new SuccessView(HttpStatusCode.OK, [customDocument, secondCustomDocument])
    expect(output).toEqual(successView)
  })

  it('should return a FailView with the correct status code and error data', async () => {
    const unauthorizedError = new BadRequestError('Error when tries to get custom documents')
    getCustomDocuments.execute.mockRejectedValue(unauthorizedError)
    const output = await sut.execute(ownerCode)
    const failView = new FailView(HttpStatusCode.NotFound, unauthorizedError)
    expect(output).toEqual(failView)
  })
})
