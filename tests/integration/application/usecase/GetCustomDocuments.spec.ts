import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import DatabaseRepositoryFactory from '@/infra/factory/DatabaseRepositoryFactory'
import { PrismaClient } from '@prisma/client'
import GetCustomDocuments from '@/application/usecase/get-custom-documents/GetCustomDocuments'
import Owner from '@/domain/entity/Owner'

describe('GetCustomDocuments', () => {
  let prisma: PrismaClient
  let repositoryFactory: RepositoryFactory
  let sut: GetCustomDocuments
  let owner: Owner

  beforeEach(async () => {
    prisma = new PrismaClient()
    repositoryFactory = new DatabaseRepositoryFactory(prisma)
    sut = new GetCustomDocuments(repositoryFactory)
    owner = new Owner('any_owner_code', 'owner_email', 'owner_user_name')
  })

  afterEach(async () => {
    const wallet = prisma.wallet.deleteMany()
    const owner = prisma.owner.deleteMany()
    const customDocument = prisma.customDocument.deleteMany()
    const customInfo = prisma.customInfo.deleteMany()
    const customInfoOnCustomDocuments = prisma.customInfoOnCustomDocuments.deleteMany()
    await prisma.$transaction([
      customInfoOnCustomDocuments,
      customInfo,
      customDocument,
      wallet,
      owner,
    ])
    await prisma.$disconnect()
  })

  it('should get custom documents', async () => {
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
    await prisma.customDocument.create({
      data: {
        owner_code: owner.ownerCode,
        name: 'any_custom_document_name',
        description: 'any_custom_document_description',
      },
    })
    await prisma.customInfo.create({
      data: {
        title: 'any_custom_info_title',
        info: 'any_custom_info_info',
        description: 'any_custom_info_description',
      },
    })
    await prisma.customInfoOnCustomDocuments.create({
      data: {
        custom_document_name: 'any_custom_document_name',
        owner_code: prismaOwner.owner_code,
        title_custom_info: 'any_custom_info_title',
      },
    })
    const customDocuments = await sut.execute(prismaOwner.owner_code)
    expect(customDocuments).toBeTruthy()
  })
})
