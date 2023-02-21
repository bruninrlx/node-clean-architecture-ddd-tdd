import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import { mock, MockProxy } from 'jest-mock-extended'
import CustomDocument from '@/domain/entity/CustomDocument'
import { UnauthorizedError } from '@/application/errors/errors'
import AddCustomInfoCustomDocument from '@/application/usecase/add-custom-info-custom-document/AddCustomInfoCustomDocument'
import { Input } from '@/application/usecase/add-custom-info-custom-document/Input'
import CustomInfoCustomDocumentRepository from '@/domain/repository/CustomInfoCustomDocumentRepository'
import CustomInfo from '@/domain/entity/CustomInfo'

describe('AddCustomInfoCustomDocument', () => {
  let repositoryFactory: MockProxy<RepositoryFactory>
  let customInfoCustomDocumentRepository: MockProxy<CustomInfoCustomDocumentRepository>
  let sut: AddCustomInfoCustomDocument
  let input: Input

  beforeEach(async () => {
    repositoryFactory = mock()
    customInfoCustomDocumentRepository = mock()
    repositoryFactory.createCustomInfoCustomDocumentRepository.mockReturnValue(
      customInfoCustomDocumentRepository
    )
    input = {
      ownerCode: 'any_owner_code',
      customDocumentTitle: 'any_custom_document',
      description: 'any_description',
      customInfo: {
        title: 'any_custom_info_title',
        info: 'any_custom_info_info',
        description: 'any_custom_info_description',
      },
    }
    sut = new AddCustomInfoCustomDocument(repositoryFactory)
  })

  it('should add an custom info to an custom document', async () => {
    const customDocument = new CustomInfo(
      input.customInfo.title,
      input.customInfo.info,
      input.customInfo.description
    )
    const output = await sut.execute(input)
    expect(customInfoCustomDocumentRepository.save).toHaveBeenCalledWith(
      input.customDocumentTitle,
      customDocument
    )
    expect(output).toEqual(customDocument)
  })

  it('should throw an error when custom info already exists', async () => {
    customInfoCustomDocumentRepository.getByOwnerCodeAndCustomDocumentNameAndCustomInfoTtitle.mockReturnValue(
      Promise.resolve(
        new CustomInfo(
          'any_custom_info_title',
          'any_custom_info_info',
          'any_custom_info_description'
        )
      )
    )
    await expect(sut.execute(input)).rejects.toThrow(
      new UnauthorizedError('Custom info already registered to this payment method')
    )
  })
})
