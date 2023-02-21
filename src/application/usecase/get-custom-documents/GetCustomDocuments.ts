import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import CustomDocumentRepository from '@/domain/repository/CustomDocumentRepository'
import { Output } from './Output'

export default class GetCustomDocuments {
  private customDocumentRepository: CustomDocumentRepository

  constructor(readonly repositoryFactory: RepositoryFactory) {
    this.customDocumentRepository = repositoryFactory.createCustomDocumentRepository()
  }

  async execute(ownerCode: string): Promise<Output> {
    const customDocuments = await this.customDocumentRepository.getCustomDocumentsByOwnerCoder(
      ownerCode
    )
    return customDocuments as Output
  }
}
