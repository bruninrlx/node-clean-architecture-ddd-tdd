import Wallet from '../entity/Wallet'

export default interface WalletRepository {
  save(wallet: Wallet): Promise<void>
  getByOwnerCode(ownerCode: string): Promise<Wallet | undefined>
}
