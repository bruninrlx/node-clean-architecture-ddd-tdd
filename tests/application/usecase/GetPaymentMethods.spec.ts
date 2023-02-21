import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import OwnerRepository from '@/domain/repository/OwnerRepository'
import WalletRepository from '@/domain/repository/WalletRepository'
import { mock, MockProxy } from 'jest-mock-extended'
import GetPaymentMethods from '@/application/usecase/get-payment-methods/GetPaymentMethods'
import PaymentMethodRepository from '@/domain/repository/PaymentMethodRepository'
import PaymentMethod from '@/domain/entity/PaymentMethod'
import Card from '@/domain/entity/Card'

describe('GetPaymentMethods', () => {
  let repositoryFactory: MockProxy<RepositoryFactory>
  let paymentMethodRepository: MockProxy<PaymentMethodRepository>
  let sut: GetPaymentMethods
  const ownerCode = 'any_owner_code'
  const mockPaymentMethods = [
    new PaymentMethod(
      'any_name',
      'any_type',
      new Card('any_card_owner', 'VISA', '4319611371569250', 'Nu Pagamentos S.A', '186', '12/2025')
    ),
    new PaymentMethod(
      'any_name_two',
      'any_type_two',
      new Card('any_card_owner_t', 'VISA', '4219611471562150', 'Bradesco S.A', '186', '12/2025')
    ),
  ]

  beforeEach(async () => {
    repositoryFactory = mock()
    paymentMethodRepository = mock()
    repositoryFactory.createPaymentMethodRepository.mockReturnValue(paymentMethodRepository)
    sut = new GetPaymentMethods(repositoryFactory)
  })

  it('should get payment methods', async () => {
    paymentMethodRepository.getPaymentMethodsByOwnerCode.mockReturnValue(
      Promise.resolve(mockPaymentMethods)
    )
    const output = await sut.execute(ownerCode)
    expect(output).toEqual(mockPaymentMethods)
  })
})
