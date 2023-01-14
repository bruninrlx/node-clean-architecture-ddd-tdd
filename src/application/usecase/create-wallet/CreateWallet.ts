import Queue from '@/application/queue/Queue'
import Owner from '@/domain/entity/Owner'
import Wallet from '@/domain/entity/Wallet'
import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import OwnerRepository from '@/domain/repository/OwnerRepository'
import WalletRepository from '@/domain/repository/WalletRepository'

export default class CreateWallet {
  private ownerRepository: OwnerRepository
  private walletRepository: WalletRepository
  private queue: Queue

  constructor(readonly repositoryFactory: RepositoryFactory, queue: Queue) {
    this.ownerRepository = repositoryFactory.createOwnerRepository()
    this.walletRepository = repositoryFactory.createWalletRepository()
    this.queue = queue
  }

  async execute(): Promise<void> {
    const owner: Owner | any = await this.queue.consume()
    await this.ownerRepository.save(new Owner(owner.id, owner.userEmail, owner.userName))
    await this.walletRepository.save(new Wallet(owner.id))
  }
}
