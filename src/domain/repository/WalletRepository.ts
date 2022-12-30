import Wallet from '../entity/Wallet'

export default interface WalletRepository {
  save(wallet: Wallet): Promise<void>
  getByCode(wallet: Wallet): Promise<Wallet>
}
