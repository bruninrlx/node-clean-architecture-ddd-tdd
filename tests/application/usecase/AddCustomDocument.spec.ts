import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import { mock, MockProxy } from 'jest-mock-extended'
import CustomDocumentRepository from '@/domain/repository/CustomDocumentRepository'
import AddCustomDocument from '@/application/usecase/add-custom-document/AddCustomDocument'
import CustomDocument from '@/domain/entity/CustomDocument'
import { Input } from './add-custom-document/Input'

describe('AddCustomDocument', () => {
  let repositoryFactory: MockProxy<RepositoryFactory>
  let customDocumentRepository: MockProxy<CustomDocumentRepository>
  let sut: AddCustomDocument
  let input: Input

  beforeEach(async () => {
    repositoryFactory = mock()
    customDocumentRepository = mock()
    repositoryFactory.createCustomDocumentRepository.mockReturnValue(customDocumentRepository)
    input = {
      ownerCode: 'any_owner_code',
      customDocumentName: 'any_custom_document',
      description: 'any_description',
    }
    sut = new AddCustomDocument(repositoryFactory)
  })

  it('should add an custom document', async () => {
    const output = await sut.execute(input)
    expect(output).toEqual(new CustomDocument(input.customDocumentName, input.description))
  })
})
