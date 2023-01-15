import Wallet from '@/domain/entity/Wallet'
import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import OwnerRepository from '@/domain/repository/OwnerRepository'
import WalletRepository from '@/domain/repository/WalletRepository'
import { mock, MockProxy } from 'jest-mock-extended'
import Owner from '@/domain/entity/Owner'
import CustomDocumentRepository from '@/domain/repository/CustomDocumentRepository'
import AddCustomDocument from '@/application/usecase/add-custom-document/addCustomDocument'
import CustomDocument from '@/domain/entity/CustomDocument'
import { NotFoundError } from '@/application/errors/errors'
import { Input } from './add-custom-document/Input'

describe('AddCustomDocument', () => {
  let repositoryFactory: MockProxy<RepositoryFactory>
  let walletRepository: MockProxy<WalletRepository>
  let ownerRepository: MockProxy<OwnerRepository>
  let customDocument: MockProxy<CustomDocumentRepository>
  let sut: AddCustomDocument
  let input: Input

  beforeEach(async () => {
    repositoryFactory = mock()
    walletRepository = mock()
    ownerRepository = mock()
    customDocument = mock()
    repositoryFactory.createWalletRepository.mockReturnValue(walletRepository)
    repositoryFactory.createOwnerRepository.mockReturnValue(ownerRepository)
    repositoryFactory.createCustomDocumentRepository.mockReturnValue(customDocument)
    input = {
      ownerCode: 'any_owner_code',
      customDocument: 'any_custom_document',
      description: 'any_description',
    }
    sut = new AddCustomDocument(repositoryFactory)
  })

  it('should add an custom document', async () => {
    walletRepository.getByOwnerCode.mockReturnValue(Promise.resolve(new Wallet('any_owner_code')))
    ownerRepository.getByCode.mockReturnValue(
      Promise.resolve(new Owner('any_owner_code', 'any_user_email', 'any_user_name'))
    )
    const output = await sut.execute(input)
    expect(output).toEqual(new CustomDocument(input.customDocument, input.description))
  })

  it('should throw an error when wallet not found', async () => {
    walletRepository.getByOwnerCode.mockReturnValue(Promise.resolve(undefined))
    await expect(sut.execute(input)).rejects.toThrow(new NotFoundError('Wallet not found'))
  })

  it('should throw an error when owner not found', async () => {
    walletRepository.getByOwnerCode.mockReturnValue(Promise.resolve(new Wallet('any_owner_code')))
    ownerRepository.getByCode.mockReturnValue(Promise.resolve(undefined))
    await expect(sut.execute(input)).rejects.toThrow(new NotFoundError('Owner not found'))
  })
})
