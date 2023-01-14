import Wallet from '@/domain/entity/Wallet'
import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import OwnerRepository from '@/domain/repository/OwnerRepository'
import WalletRepository from '@/domain/repository/WalletRepository'
import { mock, MockProxy } from 'jest-mock-extended'
import AddCustomPaymentMethod from '@/application/usecase/add-custom-payment-method/AddCustomPaymentMethod'
import Owner from '@/domain/entity/Owner'
import CustomPaymentMethodRepository from '@/domain/repository/CustomPaymentMethodRepository'
import CustomPaymentMethod from '@/domain/entity/CustomPaymentMethod'

describe('AddCustomPaymentMethod', () => {
  let repositoryFactory: MockProxy<RepositoryFactory>
  let walletRepository: MockProxy<WalletRepository>
  let ownerRepository: MockProxy<OwnerRepository>
  let customPaymentMethod: MockProxy<CustomPaymentMethodRepository>
  let sut: AddCustomPaymentMethod

  beforeEach(async () => {
    repositoryFactory = mock()
    walletRepository = mock()
    ownerRepository = mock()
    customPaymentMethod = mock()
    repositoryFactory.createWalletRepository.mockReturnValue(walletRepository)
    repositoryFactory.createOwnerRepository.mockReturnValue(ownerRepository)
    repositoryFactory.createCustomPaymentMethodRepository.mockReturnValue(customPaymentMethod)
    sut = new AddCustomPaymentMethod(repositoryFactory)
  })

  it('should create an custom payment method', async () => {
    const input = {
      ownerCode: 'any_owner_code',
      customPaymentMethod: 'any_payment_method',
      description: 'any_description',
    }
    walletRepository.getByOwnerCode.mockReturnValue(Promise.resolve(new Wallet('any_owner_code')))
    ownerRepository.getByCode.mockReturnValue(
      Promise.resolve(new Owner('any_owner_code', 'any_user_email', 'any_user_name'))
    )
    const output = await sut.execute(input)
    expect(output).toEqual(new CustomPaymentMethod(input.customPaymentMethod, input.description))
  })
})
