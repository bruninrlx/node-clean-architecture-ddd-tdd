import Card from '@/domain/entity/Card'
import PaymentMethod from '@/domain/entity/PaymentMethod'
import Wallet from '@/domain/entity/Wallet'
import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import OwnerRepository from '@/domain/repository/OwnerRepository'
import PaymentMethodRepository from '@/domain/repository/PaymentMethodRepository'
import WalletRepository from '@/domain/repository/WalletRepository'
import { mock, MockProxy } from 'jest-mock-extended'
import Owner from '@/domain/entity/Owner'
import AddPaymentMethod from '@/application/usecase/add-payment-method/AddPaymentMethod'

describe('AddPaymentMethod', () => {
  let repositoryFactory: MockProxy<RepositoryFactory>
  let paymentMethodRepository: MockProxy<PaymentMethodRepository>
  let walletRepository: MockProxy<WalletRepository>
  let ownerRepository: MockProxy<OwnerRepository>
  let sut: AddPaymentMethod

  beforeEach(async () => {
    repositoryFactory = mock()
    paymentMethodRepository = mock()
    walletRepository = mock()
    ownerRepository = mock()
    repositoryFactory.createPaymentMethodRepository.mockReturnValue(paymentMethodRepository)
    repositoryFactory.createWalletRepository.mockReturnValue(walletRepository)
    repositoryFactory.createOwnerRepository.mockReturnValue(ownerRepository)
    sut = new AddPaymentMethod(repositoryFactory)
  })

  it('Should create an payment method to wallet and save', async () => {
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
    walletRepository.getByOwnerCode.mockReturnValue(Promise.resolve(new Wallet('any_owner_code')))
    ownerRepository.getByCode.mockReturnValue(
      Promise.resolve(new Owner('any_owner_code', 'any_user_email', 'any_user_name'))
    )
    const { name, type } = input.paymentMethod
    const { ownerName, brand, cardNumber, bank, cvv, expiry } = input.paymentMethod.card
    const output = await sut.execute(input)
    const card = new Card(ownerName, brand, cardNumber, bank, cvv, expiry)
    const paymentMethod = new PaymentMethod(name, type, card)
    expect(output).toEqual(paymentMethod)
  })
})
