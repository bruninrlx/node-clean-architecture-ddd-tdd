import { UnauthorizedError } from '@/application/errors/errors'
import CustomDocument from '@/domain/entity/CustomDocument'
import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import CustomDocumentRepository from '@/domain/repository/CustomDocumentRepository'
import { Input } from './Input'
import { Output } from './Output'

export default class AddCustomDocument {
  private customDocumentRepository: CustomDocumentRepository

  constructor(readonly repositoryFactory: RepositoryFactory) {
    this.customDocumentRepository = repositoryFactory.createCustomDocumentRepository()
  }

  async execute(input: Input): Promise<Output> {
    const customDocument = await this.customDocumentRepository.getByOwnerCodeAndCustomDocumentName(
      input.ownerCode,
      input.customDocumentTitle
    )
    if (customDocument) throw new UnauthorizedError('Custom document already exists')
    const currentCustomDocument = new CustomDocument(input.customDocumentTitle, input.description)
    await this.customDocumentRepository.save(input.ownerCode, currentCustomDocument)
    return currentCustomDocument as Output
  }
}
