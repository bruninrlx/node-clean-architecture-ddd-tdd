import { UnauthorizedError } from '@/application/errors/errors'
import CustomInfo from '@/domain/entity/CustomInfo'
import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import CustomInfoCustomDocumentRepository from '@/domain/repository/CustomInfoCustomDocumentRepository'
import { Input } from './Input'
import { Output } from './Output'

export default class AddCustomInfoCustomDocument {
  private customInfoCustomDocumentRepository: CustomInfoCustomDocumentRepository

  constructor(readonly repositoryFactory: RepositoryFactory) {
    this.customInfoCustomDocumentRepository =
      repositoryFactory.createCustomInfoCustomDocumentRepository()
  }

  async execute(input: Input): Promise<Output> {
    let customInfo: CustomInfo | undefined
    try {
      customInfo =
        await this.customInfoCustomDocumentRepository.getByOwnerCodeAndCustomDocumentNameAndCustomInfoTtitle(
          input.ownerCode,
          input.customDocumentName,
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
    await this.customInfoCustomDocumentRepository.save(
      input.ownerCode,
      input.customDocumentName,
      currentCustomInfo
    )
    return currentCustomInfo as Output
  }
}
