import Card from '@/domain/entity/Card'
import PaymentMethod from '@/domain/entity/PaymentMethod'
import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import PaymentMethodRepository from '@/domain/repository/PaymentMethodRepository'
import { Input } from './Input'
import { Output } from './Output'

export default class AddPaymentMethod {
  private paymentMethodRepository: PaymentMethodRepository

  constructor(readonly repositoryFactory: RepositoryFactory) {
    this.paymentMethodRepository = repositoryFactory.createPaymentMethodRepository()
  }

  async execute(input: Input): Promise<Output> {
    const { name, type } = input.paymentMethod
    const { ownerName, brand, cardNumber, bank, cvv, expiry } = input.paymentMethod.card
    const card = new Card(ownerName, brand, cardNumber, bank, cvv, expiry)
    const paymentMethod = new PaymentMethod(name, type, card)
    await this.paymentMethodRepository.save(input.ownerCode, paymentMethod)
    return paymentMethod
  }
}
