import AddCustomDocument from '@/application/usecase/add-custom-document/AddCustomDocument'
import { Input } from '@/application/usecase/add-custom-document/Input'
import Owner from '@/domain/entity/Owner'
import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import DatabaseRepositoryFactory from '@/infra/factory/DatabaseRepositoryFactory'
import { PrismaClient } from '@prisma/client'

describe('AddCustomDocumentIntegrationTest', () => {
  let prisma: PrismaClient
  let repositoryFactory: RepositoryFactory
  let owner: Owner
  let sut: AddCustomDocument

  beforeEach(async () => {
    prisma = new PrismaClient()
    repositoryFactory = new DatabaseRepositoryFactory(prisma)
    sut = new AddCustomDocument(repositoryFactory)
    owner = new Owner('owner_code', 'owner_email', 'owner_user_name')
  })

  afterEach(async () => {
    const customDocument = prisma.customDocument.deleteMany()
    const wallet = prisma.wallet.deleteMany()
    const owner = prisma.owner.deleteMany()
    await prisma.$transaction([customDocument, wallet, owner])
    await prisma.$disconnect()
  })

  it('should add an custom document', async () => {
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
      customDocumentName: 'any_custom_document_name',
      description: 'any_custom_document_description',
    }
    await sut.execute(input)
    const customDocument = await prisma.customDocument.findFirst({
      where: {
        owner_code: prismaOwner?.owner_code,
        name: input.customDocumentName,
      },
    })
    expect(customDocument).toBeTruthy()
  })
})
