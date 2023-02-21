import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import { mock, MockProxy } from 'jest-mock-extended'
import AddCustomPaymentMethod from '@/application/usecase/add-custom-payment-method/AddCustomPaymentMethod'
import CustomPaymentMethodRepository from '@/domain/repository/CustomPaymentMethodRepository'
import CustomPaymentMethod from '@/domain/entity/CustomPaymentMethod'
import { Input } from './add-custom-payment-method/Input'

describe('AddCustomPaymentMethod', () => {
  let repositoryFactory: MockProxy<RepositoryFactory>
  let customPaymentMethod: MockProxy<CustomPaymentMethodRepository>
  let sut: AddCustomPaymentMethod
  let input: Input

  beforeEach(async () => {
    repositoryFactory = mock()
    customPaymentMethod = mock()
    repositoryFactory.createCustomPaymentMethodRepository.mockReturnValue(customPaymentMethod)
    input = {
      ownerCode: 'any_owner_code',
      customPaymentMethod: 'any_payment_method',
      description: 'any_description',
    }
    sut = new AddCustomPaymentMethod(repositoryFactory)
  })

  it('should create an custom payment method', async () => {
    const output = await sut.execute(input)
    expect(output).toEqual(new CustomPaymentMethod(input.customPaymentMethod, input.description))
  })
})
