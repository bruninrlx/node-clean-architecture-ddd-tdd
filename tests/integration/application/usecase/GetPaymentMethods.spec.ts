import { Input } from '@/application/usecase/add-payment-method/Input'
import Owner from '@/domain/entity/Owner'
import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import DatabaseRepositoryFactory from '@/infra/factory/DatabaseRepositoryFactory'
import { PrismaClient } from '@prisma/client'
import GetPaymentMethods from '@/application/usecase/get-payment-methods/GetPaymentMethods'

describe('GetPaymentMethodsIntegrationTest', () => {
  let prisma: PrismaClient
  let repositoryFactory: RepositoryFactory
  let owner: Owner
  let sut: GetPaymentMethods

  beforeEach(async () => {
    prisma = new PrismaClient()
    repositoryFactory = new DatabaseRepositoryFactory(prisma)
    sut = new GetPaymentMethods(repositoryFactory)
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

  it('should get payment methods', async () => {
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
    await prisma.card.create({
      data: {
        owner_name: input.paymentMethod.card.ownerName,
        brand: input.paymentMethod.card.brand,
        card_number: input.paymentMethod.card.cardNumber,
        bank: input.paymentMethod.card.bank,
        cvv: input.paymentMethod.card.cvv,
        expiry: input.paymentMethod.card.expiry,
      },
    })
    await prisma.paymentMethod.create({
      data: {
        name: input.paymentMethod.name,
        type: input.paymentMethod.type,
        card_number: input.paymentMethod.card.cardNumber,
        owner_code: prismaOwner.owner_code,
      },
    })
    const paymentMethods = await sut.execute(prismaOwner.owner_code)
    expect(paymentMethods).toBeTruthy()
  })
})
