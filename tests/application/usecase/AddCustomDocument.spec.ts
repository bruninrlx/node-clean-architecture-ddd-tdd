import Wallet from '@/domain/entity/Wallet'
import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import OwnerRepository from '@/domain/repository/OwnerRepository'
import WalletRepository from '@/domain/repository/WalletRepository'
import { mock, MockProxy } from 'jest-mock-extended'
import Owner from '@/domain/entity/Owner'
import CustomDocumentRepository from '@/domain/repository/CustomDocumentRepository'
import AddCustomDocument from '@/application/usecase/add-custom-document/addCustomDocument'
import CustomDocument from '@/domain/entity/CustomDocument'

describe('AddCustomDocument', () => {
  let repositoryFactory: MockProxy<RepositoryFactory>
  let walletRepository: MockProxy<WalletRepository>
  let ownerRepository: MockProxy<OwnerRepository>
  let customDocument: MockProxy<CustomDocumentRepository>
  let sut: AddCustomDocument

  beforeEach(async () => {
    repositoryFactory = mock()
    walletRepository = mock()
    ownerRepository = mock()
    customDocument = mock()
    repositoryFactory.createWalletRepository.mockReturnValue(walletRepository)
    repositoryFactory.createOwnerRepository.mockReturnValue(ownerRepository)
    repositoryFactory.createCustomDocumentRepository.mockReturnValue(customDocument)
    sut = new AddCustomDocument(repositoryFactory)
  })

  it('should create an custom document', async () => {
    const input = {
      ownerCode: 'any_owner_code',
      customDocument: 'any_custom_document',
      description: 'any_description',
    }
    walletRepository.getByOwnerCode.mockReturnValue(Promise.resolve(new Wallet('any_owner_code')))
    ownerRepository.getByCode.mockReturnValue(
      Promise.resolve(new Owner('any_owner_code', 'any_user_email', 'any_user_name'))
    )
    const output = await sut.execute(input)
    expect(output).toEqual(new CustomDocument(input.customDocument, input.description))
  })
})
