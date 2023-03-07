import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import DatabaseRepositoryFactory from '@/infra/factory/DatabaseRepositoryFactory'
import { PrismaClient } from '@prisma/client'
import CreateWallet from '@/application/usecase/create-wallet/CreateWallet'
import Queue from '@/application/queue/Queue'
import { mock, MockProxy } from 'jest-mock-extended'

describe('CreateWallet', () => {
  let prisma: PrismaClient
  let repositoryFactory: RepositoryFactory
  let sut: CreateWallet
  let queue: MockProxy<Queue>

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
    sut = new CreateWallet(repositoryFactory, queue)
  })

  afterEach(async () => {
    const wallet = prisma.wallet.deleteMany()
    const owner = prisma.owner.deleteMany()
    await prisma.$transaction([wallet, owner])
    await prisma.$disconnect()
  })

  it('should create an wallet', async () => {
    await sut.execute()
    const wallet = await prisma.wallet.findUnique({
      where: {
        owner_code: 'any_id',
      },
    })
    expect(wallet).toBeTruthy()
  })
})
