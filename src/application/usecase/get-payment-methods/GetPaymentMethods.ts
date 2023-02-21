import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import PaymentMethodRepository from '@/domain/repository/PaymentMethodRepository'
import { Output } from './Output'

export default class GetPaymentMethods {
  private paymentMethodRepository: PaymentMethodRepository

  constructor(readonly repositoryFactory: RepositoryFactory) {
    this.paymentMethodRepository = repositoryFactory.createPaymentMethodRepository()
  }

  async execute(ownerCode: string): Promise<Output> {
    const PaymentMethods = await this.paymentMethodRepository.getPaymentMethodsByOwnerCode(
      ownerCode
    )
    return PaymentMethods as Output
  }
}
