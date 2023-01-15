import { NotFoundError } from '@/application/errors/errors'
import Card from '@/domain/entity/Card'
import PaymentMethod from '@/domain/entity/PaymentMethod'
import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import OwnerRepository from '@/domain/repository/OwnerRepository'
import PaymentMethodRepository from '@/domain/repository/PaymentMethodRepository'
import WalletRepository from '@/domain/repository/WalletRepository'
import { input } from './Input'
import { output } from './Output'

export default class AddPaymentMethod {
  private ownerRepository: OwnerRepository
  private walletRepository: WalletRepository
  private paymentMethodRepository: PaymentMethodRepository

  constructor(readonly repositoryFactory: RepositoryFactory) {
    this.ownerRepository = repositoryFactory.createOwnerRepository()
    this.walletRepository = repositoryFactory.createWalletRepository()
    this.paymentMethodRepository = repositoryFactory.createPaymentMethodRepository()
  }

  async execute(input: input): Promise<output> {
    const { name, type } = input.paymentMethod
    const { ownerName, brand, cardNumber, bank, cvv, expiry } = input.paymentMethod.card
    const owner = await this.ownerRepository.getByCode(input.ownerCode)
    const wallet = await this.walletRepository.getByOwnerCode(input.ownerCode)
    if (!wallet) throw new NotFoundError('Wallet not found')
    if (!owner) throw new NotFoundError('Owner not found')
    const card = new Card(ownerName, brand, cardNumber, bank, cvv, expiry)
    const paymentMethod = new PaymentMethod(name, type, card)
    await this.paymentMethodRepository.save(paymentMethod)
    return paymentMethod
  }
}
