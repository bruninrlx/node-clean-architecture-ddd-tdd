import { Input } from '@/application/usecase/add-custom-info-custom-payment-method/Input'
import Owner from '@/domain/entity/Owner'
import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import DatabaseRepositoryFactory from '@/infra/factory/DatabaseRepositoryFactory'
import { PrismaClient } from '@prisma/client'
import AddCustomInfoCustomPaymentMethod from '@/application/usecase/add-custom-info-custom-payment-method/AddCustomInfoCustomPaymentMethod'

describe('AddCustomInfoCustomPaymentMethodIntegrationTest', () => {
  let prisma: PrismaClient
  let repositoryFactory: RepositoryFactory
  let owner: Owner
  let sut: AddCustomInfoCustomPaymentMethod

  beforeEach(async () => {
    prisma = new PrismaClient()
    repositoryFactory = new DatabaseRepositoryFactory(prisma)
    sut = new AddCustomInfoCustomPaymentMethod(repositoryFactory)
    owner = new Owner('owner_code', 'owner_email', 'owner_user_name')
  })

  afterEach(async () => {
    const customInfoOnCustomPaymentMethods = prisma.customInfoOnCustomPaymentMethods.deleteMany()
    const customInfo = prisma.customInfo.deleteMany()
    const customPaymentMethod = prisma.customPaymentMethod.deleteMany()
    const wallet = prisma.wallet.deleteMany()
    const owner = prisma.owner.deleteMany()
    await prisma.$transaction([
      customInfoOnCustomPaymentMethods,
      customInfo,
      customPaymentMethod,
      wallet,
      owner,
    ])
    await prisma.$disconnect()
  })

  it('should add an custom Info custom payment method', async () => {
    await prisma.owner.create({
      data: {
        owner_code: owner.ownerCode,
        user_email: owner.userEmail,
        user_name: owner.userName,
      },
    })
    const prismaOwner = await prisma.owner.findUnique({ where: { owner_code: owner.ownerCode } })
    if (!prismaOwner) throw new Error('fail to find owner prisma')
    await prisma.wallet.create({
      data: {
        owner_code: prismaOwner.owner_code,
      },
    })
    await prisma.customPaymentMethod.create({
      data: {
        owner_code: prismaOwner.owner_code,
        name: 'any_custom_payment_method_name',
        description: 'any_custom_payment_method_description',
      },
    })
    const input: Input = {
      ownerCode: owner.ownerCode,
      customPaymentMethodName: 'any_custom_payment_method_name',
      description: 'any_custom_payment_method_description',
      customInfo: {
        title: 'custom_info_title',
        info: 'custom_info_info',
        description: 'custom_info_description',
      },
    }
    await sut.execute(input)
    const customInfo = await prisma.customInfo.findFirst({
      where: {
        title: input.customInfo.title,
      },
      include: {
        CustomInfoOnCustomPaymentMethods: {
          where: {
            owner_code: owner.ownerCode,
            name_custom_payment_method: input.customPaymentMethodName,
            title_custom_info: input.customInfo.title,
          },
        },
      },
    })
    expect(customInfo).toBeTruthy()
  })
})
