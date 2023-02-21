import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import CustomPaymentMethodRepository from '@/domain/repository/CustomPaymentMethodRepository'
import { Output } from './Output'

export default class GetCustomPaymentMethods {
  private customPaymentMethodRepository: CustomPaymentMethodRepository

  constructor(readonly repositoryFactory: RepositoryFactory) {
    this.customPaymentMethodRepository = repositoryFactory.createCustomPaymentMethodRepository()
  }

  async execute(ownerCode: string): Promise<Output> {
    const customPaymentMethod =
      await this.customPaymentMethodRepository.getCustomPaymentMethodsByOwnerCode(ownerCode)
    return customPaymentMethod as Output
  }
}
