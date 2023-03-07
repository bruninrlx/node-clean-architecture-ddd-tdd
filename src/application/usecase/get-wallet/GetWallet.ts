import { NotFoundError } from '@/application/errors/errors'
import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import OwnerRepository from '@/domain/repository/OwnerRepository'
import WalletRepository from '@/domain/repository/WalletRepository'
import { Output } from './Output'

export default class GetWallet {
  private walletRepository: WalletRepository

  constructor(readonly repositoryFactory: RepositoryFactory) {
    this.walletRepository = repositoryFactory.createWalletRepository()
  }

  async execute(ownerCode: string): Promise<Output> {
    const wallet = await this.walletRepository.getByOwnerCode(ownerCode)
    return wallet
  }
}
