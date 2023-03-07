import { Input } from '@/application/usecase/add-payment-method/Input'
import AddPaymentMethod from '@/application/usecase/add-payment-method/AddPaymentMethod'
import Owner from '@/domain/entity/Owner'
import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import DatabaseRepositoryFactory from '@/infra/factory/DatabaseRepositoryFactory'
import { PrismaClient } from '@prisma/client'

describe('AddPaymentMethodIntegrationTest', () => {
  let prisma: PrismaClient
  let repositoryFactory: RepositoryFactory
  let owner: Owner
  let sut: AddPaymentMethod

  beforeEach(async () => {
    prisma = new PrismaClient()
    repositoryFactory = new DatabaseRepositoryFactory(prisma)
    sut = new AddPaymentMethod(repositoryFactory)
    owner = new Owner('owner_code', 'owner_email', 'owner_user_name')
  })

  afterEach(async () => {
    const wallet = prisma.wallet.deleteMany()
    const owner = prisma.owner.deleteMany()
    const paymentMethod = prisma.paymentMethod.deleteMany()
    const card = prisma.card.deleteMany()
    await prisma.$transaction([wallet, owner, paymentMethod, card])
    await prisma.$disconnect()
  })

  it('should add an payment method', async () => {
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
      paymentMethod: {
        name: 'any_payment_method',
        type: 'any_type',
        card: {
          ownerName: 'any_name',
          brand: 'any_brand',
          cardNumber: 'any_cardNumber',
          bank: 'any_bank',
          cvv: 'any_cvv',
          expiry: 'any_expiry',
        },
      },
    }
    await sut.execute(input)
    const paymentMethod = await prisma.paymentMethod.findFirst({
      where: {
        owner_code: prismaOwner?.owner_code,
        name: input.paymentMethod.name,
      },
    })
    expect(paymentMethod).toBeTruthy()
  })
})
