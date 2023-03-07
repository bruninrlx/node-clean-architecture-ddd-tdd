import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import CustomDocumentRepository from '@/domain/repository/CustomDocumentRepository'
import CustomInfoCustomDocumentRepository from '@/domain/repository/CustomInfoCustomDocumentRepository'
import CustomInfoCustomPaymentMethodRepository from '@/domain/repository/CustomInfoCustomPaymentMethodRepository'
import CustomPaymentMethodRepository from '@/domain/repository/CustomPaymentMethodRepository'
import OwnerRepository from '@/domain/repository/OwnerRepository'
import PaymentMethodRepository from '@/domain/repository/PaymentMethodRepository'
import WalletRepository from '@/domain/repository/WalletRepository'
import { PrismaClient } from '@prisma/client'
import { CustomDocumentRepositoryDatabase } from '../repository/database/CustomDocumentRepositoryDatabase'
import { CustomInfoCustomDocumentRepositoryDatabase } from '../repository/database/CustomInfoCustomDocumentRepositoryDatabase'
import { CustomInfoCustomPaymentMethodRepositoryDatabase } from '../repository/database/CustomInfoCustomPaymentMethodDatabase'
import { CustomPaymentMethodRepositoryDatabase } from '../repository/database/CustomPaymentMethodRepositoryDatabase'
import { OwnerRepositoryDatabase } from '../repository/database/OwnerRepositoryDatabase'
import { PaymentMethodRepositoryDatabase } from '../repository/database/PaymentMethodRepositoryDatabase'
import { WalletRepositoryDatabase } from '../repository/database/WalletRepositoryDatabase'

export default class DatabaseRepositoryFactory implements RepositoryFactory {
  constructor(readonly prisma: PrismaClient) {}

  createWalletRepository(): WalletRepository {
    return new WalletRepositoryDatabase(
      this.prisma,
      this.createCustomDocumentRepository(),
      this.createCustomPaymentMethodRepository(),
      this.createPaymentMethodRepository()
    )
  }
  createOwnerRepository(): OwnerRepository {
    return new OwnerRepositoryDatabase(this.prisma)
  }
  createPaymentMethodRepository(): PaymentMethodRepository {
    return new PaymentMethodRepositoryDatabase(this.prisma)
  }
  createCustomPaymentMethodRepository(): CustomPaymentMethodRepository {
    return new CustomPaymentMethodRepositoryDatabase(this.prisma)
  }
  createCustomDocumentRepository(): CustomDocumentRepository {
    return new CustomDocumentRepositoryDatabase(this.prisma)
  }
  createCustomInfoCustomPaymentMethodRepository(): CustomInfoCustomPaymentMethodRepository {
    return new CustomInfoCustomPaymentMethodRepositoryDatabase(this.prisma)
  }
  createCustomInfoCustomDocumentRepository(): CustomInfoCustomDocumentRepository {
    return new CustomInfoCustomDocumentRepositoryDatabase(this.prisma)
  }
}
