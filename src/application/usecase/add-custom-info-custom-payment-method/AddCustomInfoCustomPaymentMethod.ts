import { UnauthorizedError } from '@/application/errors/errors'
import CustomInfo from '@/domain/entity/CustomInfo'
import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import CustomInfoCustomPaymentMethodRepository from '@/domain/repository/CustomInfoCustomPaymentMethodRepository'
import { Input } from './Input'
import { Output } from './Output'

export default class AddCustomInfoCustomPaymentMethod {
  private customInfoCustomPaymentMethodRepository: CustomInfoCustomPaymentMethodRepository

  constructor(readonly repositoryFactory: RepositoryFactory) {
    this.customInfoCustomPaymentMethodRepository =
      repositoryFactory.createCustomInfoCustomPaymentMethodRepository()
  }

  async execute(input: Input): Promise<Output> {
    let customInfo: CustomInfo | undefined
    try {
      customInfo =
        await this.customInfoCustomPaymentMethodRepository.getByOwnerCodeAndCustomPaymentMethodNameAndCustomInfoTtitle(
          input.ownerCode,
          input.customPaymentMethodName,
          input.customInfo.title
        )
    } catch (error) {
      customInfo = undefined
    }
    if (customInfo)
      throw new UnauthorizedError('Custom info already registered to this payment method')
    const currentCustomInfo = new CustomInfo(
      input.customInfo.title,
      input.customInfo.info,
      input.customInfo.description
    )
    await this.customInfoCustomPaymentMethodRepository.save(
      input.ownerCode,
      input.customPaymentMethodName,
      currentCustomInfo
    )
    return currentCustomInfo as Output
  }
}
