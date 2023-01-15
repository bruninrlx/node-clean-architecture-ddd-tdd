import Wallet from '@/domain/entity/Wallet'
import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import OwnerRepository from '@/domain/repository/OwnerRepository'
import WalletRepository from '@/domain/repository/WalletRepository'
import { mock, MockProxy } from 'jest-mock-extended'
import AddCustomPaymentMethod from '@/application/usecase/add-custom-payment-method/AddCustomPaymentMethod'
import Owner from '@/domain/entity/Owner'
import CustomPaymentMethodRepository from '@/domain/repository/CustomPaymentMethodRepository'
import CustomPaymentMethod from '@/domain/entity/CustomPaymentMethod'
import { Input } from './add-custom-payment-method/Input'
import { NotFoundError } from '@/application/errors/errors'

describe('AddCustomPaymentMethod', () => {
  let repositoryFactory: MockProxy<RepositoryFactory>
  let walletRepository: MockProxy<WalletRepository>
  let ownerRepository: MockProxy<OwnerRepository>
  let customPaymentMethod: MockProxy<CustomPaymentMethodRepository>
  let sut: AddCustomPaymentMethod
  let input: Input

  beforeEach(async () => {
    repositoryFactory = mock()
    walletRepository = mock()
    ownerRepository = mock()
    customPaymentMethod = mock()
    repositoryFactory.createWalletRepository.mockReturnValue(walletRepository)
    repositoryFactory.createOwnerRepository.mockReturnValue(ownerRepository)
    repositoryFactory.createCustomPaymentMethodRepository.mockReturnValue(customPaymentMethod)
    input = {
      ownerCode: 'any_owner_code',
      customPaymentMethod: 'any_payment_method',
      description: 'any_description',
    }
    sut = new AddCustomPaymentMethod(repositoryFactory)
  })

  it('should create an custom payment method', async () => {
    walletRepository.getByOwnerCode.mockReturnValue(Promise.resolve(new Wallet('any_owner_code')))
    ownerRepository.getByCode.mockReturnValue(
      Promise.resolve(new Owner('any_owner_code', 'any_user_email', 'any_user_name'))
    )
    const output = await sut.execute(input)
    expect(output).toEqual(new CustomPaymentMethod(input.customPaymentMethod, input.description))
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
