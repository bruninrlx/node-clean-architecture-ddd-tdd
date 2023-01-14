import CustomPaymentMethod from '@/domain/entity/CustomPaymentMethod'
import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import CustomPaymentMethodRepository from '@/domain/repository/CustomPaymentMethodRepository'
import OwnerRepository from '@/domain/repository/OwnerRepository'
import WalletRepository from '@/domain/repository/WalletRepository'
import { Input } from './Input'
import { Output } from './Output'

export default class AddCustomPaymentMethod {
  private ownerRepository: OwnerRepository
  private walletRepository: WalletRepository
  private customPaymentRepository: CustomPaymentMethodRepository

  constructor(readonly repositoryFactory: RepositoryFactory) {
    this.ownerRepository = repositoryFactory.createOwnerRepository()
    this.walletRepository = repositoryFactory.createWalletRepository()
    this.customPaymentRepository = repositoryFactory.createCustomPaymentMethodRepository()
  }

  async execute(input: Input): Promise<Output> {
    const wallet = this.walletRepository.getByOwnerCode(input.ownerCode)
    const owner = await this.ownerRepository.getByCode(input.ownerCode)
    const customPaymentMethod =
      await this.customPaymentRepository.getByOwnerCodeAndCustomPaymentMethodTitle(
        input.ownerCode,
        input.customPaymentMethod
      )

    if (!wallet) throw new Error('Wallet not found')
    if (!owner) throw new Error('Owner not found')
    if (customPaymentMethod) throw new Error('Custom payment method already exists')

    await this.customPaymentRepository.save(
      new CustomPaymentMethod(input.customPaymentMethod, input.description)
    )

    return {
      name: input.customPaymentMethod,
      description: input.description,
      customInfos: [],
    }
  }
}
