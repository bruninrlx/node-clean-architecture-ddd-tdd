import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import { mock, MockProxy } from 'jest-mock-extended'
import CustomPaymentMethodRepository from '@/domain/repository/CustomPaymentMethodRepository'
import GetCustomPaymentMethods from '@/application/usecase/get-custom-payment-methods/GetCustomPaymentMethods'
import CustomPaymentMethod from '@/domain/entity/CustomPaymentMethod'

describe('GetCustomPaymentMethods', () => {
  let repositoryFactory: MockProxy<RepositoryFactory>
  let customPaymentMethodRepository: MockProxy<CustomPaymentMethodRepository>
  let sut: GetCustomPaymentMethods
  const ownerCode = 'any_owner_code'
  const mockCustomPaymentMethods = [
    new CustomPaymentMethod('any_name', 'any_description'),
    new CustomPaymentMethod('any_name_two', 'any_description_two'),
  ]

  beforeEach(async () => {
    repositoryFactory = mock()
    customPaymentMethodRepository = mock()
    repositoryFactory.createCustomPaymentMethodRepository.mockReturnValue(
      customPaymentMethodRepository
    )
    sut = new GetCustomPaymentMethods(repositoryFactory)
  })

  it('should get custom payment methods', async () => {
    customPaymentMethodRepository.getCustomPaymentMethodsByOwnerCode.mockReturnValue(
      Promise.resolve(mockCustomPaymentMethods)
    )
    const output = await sut.execute(ownerCode)
    expect(output).toEqual(mockCustomPaymentMethods)
  })
})
