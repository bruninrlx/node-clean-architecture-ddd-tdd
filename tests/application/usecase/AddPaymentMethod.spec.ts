import Card from '@/domain/entity/Card'
import PaymentMethod from '@/domain/entity/PaymentMethod'
import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import PaymentMethodRepository from '@/domain/repository/PaymentMethodRepository'
import { mock, MockProxy } from 'jest-mock-extended'
import AddPaymentMethod from '@/application/usecase/add-payment-method/AddPaymentMethod'

describe('AddPaymentMethod', () => {
  let repositoryFactory: MockProxy<RepositoryFactory>
  let paymentMethodRepository: MockProxy<PaymentMethodRepository>
  let sut: AddPaymentMethod

  const input = {
    ownerCode: 'any_owner_code',
    paymentMethod: {
      name: 'any_payment_method',
      type: 'any_type',
      card: {
        ownerName: 'any_name',
        brand: 'any_brand',
        cardNumber: 'any_cardNumber',
        bank: 'any_bank',
        cvv: 'any_cvv',
        expiry: 'any_expiry',
      },
    },
  }

  beforeEach(async () => {
    repositoryFactory = mock()
    paymentMethodRepository = mock()
    repositoryFactory.createPaymentMethodRepository.mockReturnValue(paymentMethodRepository)
    sut = new AddPaymentMethod(repositoryFactory)
  })

  it('Should create an payment method to wallet and save', async () => {
    const { ownerName, brand, cardNumber, bank, cvv, expiry } = input.paymentMethod.card
    const paymentMethod = new PaymentMethod(
      input.paymentMethod.name,
      input.paymentMethod.type,
      new Card(ownerName, brand, cardNumber, bank, cvv, expiry)
    )
    const output = await sut.execute(input)
    expect(output).toEqual(paymentMethod)
  })
})
