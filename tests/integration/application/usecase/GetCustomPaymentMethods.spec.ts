import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import DatabaseRepositoryFactory from '@/infra/factory/DatabaseRepositoryFactory'
import { PrismaClient } from '@prisma/client'
import Owner from '@/domain/entity/Owner'
import GetCustomPaymentMethods from '@/application/usecase/get-custom-payment-methods/GetCustomPaymentMethods'

describe('GetCustomPaymentMethods', () => {
  let prisma: PrismaClient
  let repositoryFactory: RepositoryFactory
  let sut: GetCustomPaymentMethods
  let owner: Owner

  beforeEach(async () => {
    prisma = new PrismaClient()
    repositoryFactory = new DatabaseRepositoryFactory(prisma)
    sut = new GetCustomPaymentMethods(repositoryFactory)
    owner = new Owner('any_owner_code', 'owner_email', 'owner_user_name')
  })

  afterEach(async () => {
    const wallet = prisma.wallet.deleteMany()
    const owner = prisma.owner.deleteMany()
    const customPaymentMethod = prisma.customPaymentMethod.deleteMany()
    const customInfo = prisma.customInfo.deleteMany()
    const customInfoOnCustomPaymentMethods = prisma.customInfoOnCustomPaymentMethods.deleteMany()
    await prisma.$transaction([
      customInfoOnCustomPaymentMethods,
      customInfo,
      customPaymentMethod,
      wallet,
      owner,
    ])
    await prisma.$disconnect()
  })

  it('should get custom payment methods', async () => {
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
        owner_code: owner.ownerCode,
        name: 'any_custom_payment_method_name',
        description: 'any_custom_payment_method_description',
      },
    })
    await prisma.customInfo.create({
      data: {
        title: 'any_custom_info_title',
        info: 'any_custom_info_info',
        description: 'any_custom_info_description',
      },
    })
    await prisma.customInfoOnCustomPaymentMethods.create({
      data: {
        name_custom_payment_method: 'any_custom_payment_method_name',
        owner_code: prismaOwner.owner_code,
        title_custom_info: 'any_custom_info_title',
      },
    })
    const customPaymentMethods = await sut.execute(prismaOwner.owner_code)
    expect(customPaymentMethods).toBeTruthy()
  })
})
