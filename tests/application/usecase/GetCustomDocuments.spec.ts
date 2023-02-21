import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import { mock, MockProxy } from 'jest-mock-extended'
import GetCustomDocuments from '@/application/usecase/get-custom-documents/GetCustomDocuments'
import CustomDocumentRepository from '@/domain/repository/CustomDocumentRepository'
import CustomDocument from '@/domain/entity/CustomDocument'

describe('GetCustomDocuments', () => {
  let repositoryFactory: MockProxy<RepositoryFactory>
  let customDocumentRepository: MockProxy<CustomDocumentRepository>
  let sut: GetCustomDocuments
  const ownerCode = 'any_owner_code'
  const mockCustomDocuments = [
    new CustomDocument('any_name', 'any_description'),
    new CustomDocument('any_name_two', 'any_description_two'),
  ]

  beforeEach(async () => {
    repositoryFactory = mock()
    customDocumentRepository = mock()
    repositoryFactory.createCustomDocumentRepository.mockReturnValue(customDocumentRepository)
    sut = new GetCustomDocuments(repositoryFactory)
  })

  it('should get custom documents', async () => {
    customDocumentRepository.getCustomDocumentsByOwnerCoder.mockReturnValue(
      Promise.resolve(mockCustomDocuments)
    )
    const output = await sut.execute(ownerCode)
    expect(output).toEqual(mockCustomDocuments)
  })
})
