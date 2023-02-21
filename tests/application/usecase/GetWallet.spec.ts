import Wallet from '@/domain/entity/Wallet'
import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import WalletRepository from '@/domain/repository/WalletRepository'
import { mock, MockProxy } from 'jest-mock-extended'
import GetWallet from '@/application/usecase/get-wallet/GetWallet'

describe('GetWallets', () => {
  let repositoryFactory: MockProxy<RepositoryFactory>
  let walletRepository: MockProxy<WalletRepository>
  let sut: GetWallet
  const ownerCode = 'any_owner_code'

  beforeEach(async () => {
    repositoryFactory = mock()
    walletRepository = mock()
    repositoryFactory.createWalletRepository.mockReturnValue(walletRepository)
    sut = new GetWallet(repositoryFactory)
  })

  it('should get Wallet', async () => {
    walletRepository.getByOwnerCode.mockReturnValue(Promise.resolve(new Wallet('any_owner_code')))
    const output = await sut.execute(ownerCode)
    expect(output).toEqual(new Wallet('any_owner_code'))
  })
})
