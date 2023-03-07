import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import DatabaseRepositoryFactory from '@/infra/factory/DatabaseRepositoryFactory'
import { PrismaClient } from '@prisma/client'
import CreateWallet from '@/application/usecase/create-wallet/CreateWallet'
import Queue from '@/application/queue/Queue'
import { mock, MockProxy } from 'jest-mock-extended'
import Owner from '@/domain/entity/Owner'
import GetWallet from '@/application/usecase/get-wallet/GetWallet'

describe('GetWallet', () => {
  let prisma: PrismaClient
  let repositoryFactory: RepositoryFactory
  let sut: GetWallet
  let queue: MockProxy<Queue>
  let owner: Owner

  beforeEach(async () => {
    prisma = new PrismaClient()
    repositoryFactory = new DatabaseRepositoryFactory(prisma)
    queue = mock()
    queue.consume.mockReturnValue(
      Promise.resolve({
        id: 'any_id',
        userEmail: 'any_user_email',
        userName: 'any_user_name',
      })
    )
    owner = new Owner('owner_code', 'owner_email', 'owner_user_name')
    sut = new GetWallet(repositoryFactory)
  })

  afterEach(async () => {
    const wallet = prisma.wallet.deleteMany()
    const owner = prisma.owner.deleteMany()
    await prisma.$transaction([wallet, owner])
    await prisma.$disconnect()
  })

  it('should get an wallet', async () => {
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
    const wallet = await sut.execute(owner.ownerCode)
    expect(wallet).toBeTruthy()
  })
})
