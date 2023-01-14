import CustomPaymentMethod from '@/domain/entity/CustomPaymentMethod'
import CustomInfo from '@/domain/entity/CustomInfo'
import CustomDocument from '@/domain/entity/CustomDocument'
import { mock, MockProxy } from 'jest-mock-extended'
import WalletRepository from '@/domain/repository/WalletRepository'
import Wallet from '@/domain/entity/Wallet'
import Owner from '@/domain/entity/Owner'
import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import Queue from '@/application/queue/Queue'
import CreateWallet from '@/application/usecase/create-wallet/CreateWallet'
import OwnerRepository from '@/domain/repository/OwnerRepository'

describe('CreateAnWallet', () => {
  let repositoryFactory: MockProxy<RepositoryFactory>
  let queue: MockProxy<Queue>

  beforeEach(() => {
    repositoryFactory = mock<RepositoryFactory>()
    queue = mock()

    const ownerRepository = mock<OwnerRepository>()

    const walletRepository = mock<WalletRepository>()

    repositoryFactory.createOwnerRepository.mockReturnValue(ownerRepository)
    repositoryFactory.createWalletRepository.mockReturnValue(walletRepository)

    queue.consume.mockResolvedValue({
      id: 'any_id',
      userEmail: 'mumuzera@gmail.com',
      userName: 'muricastilho',
    })
  })

  it('Should consume from queue an user informations and create an wallet and his owner', async () => {
    const owner = await queue.consume()
    await new CreateWallet(repositoryFactory, queue).execute()
    expect(repositoryFactory.createOwnerRepository().save).toHaveBeenCalledWith(
      new Owner(owner.id, owner.userEmail, owner.userName)
    )
    expect(repositoryFactory.createWalletRepository().save).toHaveBeenCalledWith(
      new Wallet(owner.id)
    )
  })
})
