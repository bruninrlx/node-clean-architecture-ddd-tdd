import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import OwnerRepository from '@/domain/repository/OwnerRepository'
import WalletRepository from '@/domain/repository/WalletRepository'
import { mock, MockProxy } from 'jest-mock-extended'
import { UnauthorizedError } from '@/application/errors/errors'
import { Input } from '@/application/usecase/add-custom-info-custom-payment-method/Input'
import CustomInfo from '@/domain/entity/CustomInfo'
import CustomInfoCustomPaymentMethodRepository from '@/domain/repository/CustomInfoCustomPaymentMethodRepository'
import AddCustomInfoCustomPaymentMethod from '@/application/usecase/add-custom-info-custom-payment-method/AddCustomInfoCustomPaymentMethod'
import CustomPaymentMethodRepository from '@/domain/repository/CustomPaymentMethodRepository'

describe('AddCustomInfoCustomPaymentMethod', () => {
  let repositoryFactory: MockProxy<RepositoryFactory>
  let walletRepository: MockProxy<WalletRepository>
  let ownerRepository: MockProxy<OwnerRepository>
  let customInfoCustomPaymentMethodRepository: MockProxy<CustomInfoCustomPaymentMethodRepository>
  let customPaymentMethodRepository: MockProxy<CustomPaymentMethodRepository>
  let sut: AddCustomInfoCustomPaymentMethod
  let input: Input

  beforeEach(async () => {
    repositoryFactory = mock()
    walletRepository = mock()
    ownerRepository = mock()
    customInfoCustomPaymentMethodRepository = mock()
    customPaymentMethodRepository = mock()
    repositoryFactory.createWalletRepository.mockReturnValue(walletRepository)
    repositoryFactory.createOwnerRepository.mockReturnValue(ownerRepository)
    repositoryFactory.createCustomPaymentMethodRepository.mockReturnValue(
      customPaymentMethodRepository
    )
    repositoryFactory.createCustomInfoCustomPaymentMethodRepository.mockReturnValue(
      customInfoCustomPaymentMethodRepository
    )
    input = {
      ownerCode: 'any_owner_code',
      customPaymentMethodTitle: 'any_custom_payment_method_title',
      description: 'any_description',
      customInfo: {
        title: 'any_custom_info_title',
        info: 'any_custom_info_info',
        description: 'any_custom_info_description',
      },
    }
    sut = new AddCustomInfoCustomPaymentMethod(repositoryFactory)
  })

  it('should add an custom info to an Custom Payment Method', async () => {
    const customInfo = new CustomInfo(
      input.customInfo.title,
      input.customInfo.info,
      input.customInfo.description
    )
    const output = await sut.execute(input)
    expect(customInfoCustomPaymentMethodRepository.save).toHaveBeenCalledWith(
      input.ownerCode,
      input.customPaymentMethodTitle,
      customInfo
    )
    expect(output).toEqual(customInfo)
  })

  it('should throw an error when custom info already exists', async () => {
    customInfoCustomPaymentMethodRepository.getByOwnerCodeAndCustomPaymentMethodNameAndCustomInfoTtitle.mockReturnValue(
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
