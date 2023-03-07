import { Input } from '@/application/usecase/add-custom-payment-method/Input'
import AddCustomPaymentMethod from '@/application/usecase/add-custom-payment-method/AddCustomPaymentMethod'
import Owner from '@/domain/entity/Owner'
import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import DatabaseRepositoryFactory from '@/infra/factory/DatabaseRepositoryFactory'
import { PrismaClient } from '@prisma/client'

describe('AddCustomPaymentMethodIntegrationTest', () => {
  let prisma: PrismaClient
  let repositoryFactory: RepositoryFactory
  let owner: Owner
  let sut: AddCustomPaymentMethod

  beforeEach(async () => {
    prisma = new PrismaClient()
    repositoryFactory = new DatabaseRepositoryFactory(prisma)
    sut = new AddCustomPaymentMethod(repositoryFactory)
    owner = new Owner('owner_code', 'owner_email', 'owner_user_name')
  })

  afterEach(async () => {
    const customPaymentMethod = prisma.customPaymentMethod.deleteMany()
    const wallet = prisma.wallet.deleteMany()
    const owner = prisma.owner.deleteMany()
    await prisma.$transaction([customPaymentMethod, wallet, owner])
    await prisma.$disconnect()
  })

  it('should add an custom payment method', async () => {
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
    const input: Input = {
      ownerCode: prismaOwner?.owner_code,
      customPaymentMethodName: 'any_custom_payment_method_name',
      description: 'any_custom_payment_method_description',
    }
    await sut.execute(input)
    const customPaymentMethod = await prisma.customPaymentMethod.findFirst({
      where: {
        owner_code: prismaOwner?.owner_code,
        name: input.customPaymentMethodName,
      },
    })
    expect(customPaymentMethod).toBeTruthy()
  })
})
