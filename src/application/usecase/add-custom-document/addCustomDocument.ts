import { NotFoundError, UnauthorizedError } from '@/application/errors/errors'
import CustomDocument from '@/domain/entity/CustomDocument'
import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import CustomDocumentRepository from '@/domain/repository/CustomDocumentRepository'
import OwnerRepository from '@/domain/repository/OwnerRepository'
import WalletRepository from '@/domain/repository/WalletRepository'
import { Input } from './Input'
import { Output } from './Output'

export default class AddCustomDocument {
  private ownerRepository: OwnerRepository
  private walletRepository: WalletRepository
  private customDocumentRepository: CustomDocumentRepository

  constructor(readonly repositoryFactory: RepositoryFactory) {
    this.ownerRepository = repositoryFactory.createOwnerRepository()
    this.walletRepository = repositoryFactory.createWalletRepository()
    this.customDocumentRepository = repositoryFactory.createCustomDocumentRepository()
  }

  async execute(input: Input): Promise<Output> {
    const wallet = await this.walletRepository.getByOwnerCode(input.ownerCode)
    const owner = await this.ownerRepository.getByCode(input.ownerCode)
    const customDocument = await this.customDocumentRepository.getByOwnerCodeAndCustomDocumentTitle(
      input.ownerCode,
      input.customDocument
    )
    if (!wallet) throw new NotFoundError('Wallet not found')
    if (!owner) throw new NotFoundError('Owner not found')
    if (customDocument) throw new UnauthorizedError('Custom document already exists')
    await this.customDocumentRepository.save(
      new CustomDocument(input.customDocument, input.description)
    )
    return {
      name: input.customDocument,
      description: input.description,
      customInfos: [],
    }
  }
}
