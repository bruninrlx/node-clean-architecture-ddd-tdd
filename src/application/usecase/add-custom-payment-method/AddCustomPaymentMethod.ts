import { UnauthorizedError } from '@/application/errors/errors'
import CustomPaymentMethod from '@/domain/entity/CustomPaymentMethod'
import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import CustomPaymentMethodRepository from '@/domain/repository/CustomPaymentMethodRepository'
import { Input } from './Input'
import { Output } from './Output'

export default class AddCustomPaymentMethod {
  private customPaymentRepository: CustomPaymentMethodRepository

  constructor(readonly repositoryFactory: RepositoryFactory) {
    this.customPaymentRepository = repositoryFactory.createCustomPaymentMethodRepository()
  }

  async execute(input: Input): Promise<Output> {
    const customPaymentMethod =
      await this.customPaymentRepository.getByOwnerCodeAndCustomPaymentMethodName(
        input.ownerCode,
        input.customPaymentMethod
      )
    if (customPaymentMethod) throw new UnauthorizedError('Custom payment method already exists')
    const currentCustomPaymentMethod = new CustomPaymentMethod(
      input.customPaymentMethod,
      input.description
    )
    await this.customPaymentRepository.save(input.ownerCode, currentCustomPaymentMethod)
    return currentCustomPaymentMethod as Output
  }
}
