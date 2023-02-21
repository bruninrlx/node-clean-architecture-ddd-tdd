import CustomDocumentRepository from '../repository/CustomDocumentRepository'
import CustomInfoCustomDocumentRepository from '../repository/CustomInfoCustomDocumentRepository'
import CustomInfoCustomPaymentMethodRepository from '../repository/CustomInfoCustomPaymentMethodRepository'
import CustomPaymentMethodRepository from '../repository/CustomPaymentMethodRepository'
import OwnerRepository from '../repository/OwnerRepository'
import PaymentMethodRepository from '../repository/PaymentMethodRepository'
import WalletRepository from '../repository/WalletRepository'

export default interface RepositoryFactory {
  createWalletRepository(): WalletRepository
  createOwnerRepository(): OwnerRepository
  createPaymentMethodRepository(): PaymentMethodRepository
  createCustomPaymentMethodRepository(): CustomPaymentMethodRepository
  createCustomDocumentRepository(): CustomDocumentRepository
  createCustomInfoCustomPaymentMethodRepository(): CustomInfoCustomPaymentMethodRepository
  createCustomInfoCustomDocumentRepository(): CustomInfoCustomDocumentRepository
}
