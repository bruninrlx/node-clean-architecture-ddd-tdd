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
    const customInfo =
      await this.customInfoCustomDocumentRepository.getByOwnerCodeAndCustomDocumentNameAndCustomInfoTtitle(
        input.ownerCode,
        input.customDocumentTitle,
        input.customInfo.title
      )
    if (customInfo)
      throw new UnauthorizedError('Custom info already registered to this payment method')
    const currentCustomInfo = new CustomInfo(
      input.customInfo.title,
      input.customInfo.info,
      input.customInfo.description
    )
    await this.customInfoCustomDocumentRepository.save(input.customDocumentTitle, currentCustomInfo)
    return currentCustomInfo as Output
  }
}
