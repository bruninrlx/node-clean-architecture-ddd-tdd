import { NotFoundError } from '@/application/errors/errors'
import Wallet from '@/domain/entity/Wallet'
import CustomDocumentRepository from '@/domain/repository/CustomDocumentRepository'
import CustomPaymentMethodRepository from '@/domain/repository/CustomPaymentMethodRepository'
import PaymentMethodRepository from '@/domain/repository/PaymentMethodRepository'
import WalletRepository from '@/domain/repository/WalletRepository'
import { PrismaClient } from '@prisma/client'

export class WalletRepositoryDatabase implements WalletRepository {
  constructor(
    readonly prisma: PrismaClient,
    readonly customDocumentRepository: CustomDocumentRepository,
    readonly customPaymentMethodRepository: CustomPaymentMethodRepository,
    readonly paymentMethodRepository: PaymentMethodRepository
  ) {}

  async save(wallet: Wallet): Promise<void> {
    await this.prisma.wallet.create({
      data: {
        owner_code: wallet.ownerCode,
      },
    })
  }
  async getByOwnerCode(ownerCode: string): Promise<Wallet> {
    const walletPrisma = await this.prisma.wallet.findUnique({
      where: {
        owner_code: ownerCode,
      },
    })
    if (!walletPrisma) throw new NotFoundError('Wallet not found')
    const wallet = new Wallet(ownerCode)
    const customDocuments = await this.customDocumentRepository
      .getCustomDocumentsByOwnerCoder(ownerCode)
      .then((customDocument) => customDocument)
      .catch(() => [])
    const customPaymentMethods = await this.customPaymentMethodRepository
      .getCustomPaymentMethodsByOwnerCode(ownerCode)
      .then((customPaymentMethod) => customPaymentMethod)
      .catch(() => [])
    const paymentMethods = await this.paymentMethodRepository
      .getPaymentMethodsByOwnerCode(ownerCode)
      .then((paymentMethod) => paymentMethod)
      .catch(() => [])
    if (customDocuments.length)
      customDocuments.forEach((customDocument) => wallet.addCustomDocument(customDocument))
    if (customPaymentMethods.length)
      customPaymentMethods.forEach((customPayment) => wallet.addCustomPaymentMethod(customPayment))
    if (paymentMethods.length)
      paymentMethods.forEach((paymentMethod) => wallet.addPaymentMethod(paymentMethod))
    return wallet
  }
}
