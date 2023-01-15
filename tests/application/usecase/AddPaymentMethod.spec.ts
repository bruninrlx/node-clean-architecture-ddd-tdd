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
import { NotFoundError } from '@/application/errors/errors'

describe('AddPaymentMethod', () => {
  let repositoryFactory: MockProxy<RepositoryFactory>
  let paymentMethodRepository: MockProxy<PaymentMethodRepository>
  let walletRepository: MockProxy<WalletRepository>
  let ownerRepository: MockProxy<OwnerRepository>
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
    walletRepository = mock()
    ownerRepository = mock()
    repositoryFactory.createPaymentMethodRepository.mockReturnValue(paymentMethodRepository)
    repositoryFactory.createWalletRepository.mockReturnValue(walletRepository)
    repositoryFactory.createOwnerRepository.mockReturnValue(ownerRepository)
    sut = new AddPaymentMethod(repositoryFactory)
  })

  it('Should create an payment method to wallet and save', async () => {
    walletRepository.getByOwnerCode.mockReturnValue(Promise.resolve(new Wallet('any_owner_code')))
    ownerRepository.getByCode.mockReturnValue(
      Promise.resolve(new Owner('any_owner_code', 'any_user_email', 'any_user_name'))
    )
    const { ownerName, brand, cardNumber, bank, cvv, expiry } = input.paymentMethod.card
    const paymentMethod = new PaymentMethod(
      input.paymentMethod.name,
      input.paymentMethod.type,
      new Card(ownerName, brand, cardNumber, bank, cvv, expiry)
    )
    const output = await sut.execute(input)
    expect(output).toEqual(paymentMethod)
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
