import { Input } from '@/application/usecase/add-custom-info-custom-document/Input'
import AddCustomInfoCustomDocument from '@/application/usecase/add-custom-info-custom-document/AddCustomInfoCustomDocument'
import Owner from '@/domain/entity/Owner'
import RepositoryFactory from '@/domain/factory/RepositoryFactory'
import DatabaseRepositoryFactory from '@/infra/factory/DatabaseRepositoryFactory'
import { PrismaClient } from '@prisma/client'

describe('AddCustomInfoCustomDocumentIntegrationTest', () => {
  let prisma: PrismaClient
  let repositoryFactory: RepositoryFactory
  let owner: Owner
  let sut: AddCustomInfoCustomDocument

  beforeEach(async () => {
    prisma = new PrismaClient()
    repositoryFactory = new DatabaseRepositoryFactory(prisma)
    sut = new AddCustomInfoCustomDocument(repositoryFactory)
    owner = new Owner('owner_code', 'owner_email', 'owner_user_name')
  })

  afterEach(async () => {
    const customInfoOnCustomDocuments = prisma.customInfoOnCustomDocuments.deleteMany()
    const customInfo = prisma.customInfo.deleteMany()
    const customDocument = prisma.customDocument.deleteMany()
    const wallet = prisma.wallet.deleteMany()
    const owner = prisma.owner.deleteMany()
    await prisma.$transaction([
      customInfoOnCustomDocuments,
      customInfo,
      customDocument,
      wallet,
      owner,
    ])
    await prisma.$disconnect()
  })

  it('should add an custom Info custom document', async () => {
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
        owner_code: prismaOwner.owner_code,
        name: 'any_custom_document_name',
        description: 'any_custom_document_description',
      },
    })
    const input: Input = {
      ownerCode: owner.ownerCode,
      customDocumentName: 'any_custom_document_name',
      description: 'any_custom_document_description',
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
        CustomInfoOnCustomDocuments: {
          where: {
            owner_code: owner.ownerCode,
            custom_document_name: input.customDocumentName,
            title_custom_info: input.customInfo.title,
          },
        },
      },
    })
    expect(customInfo).toBeTruthy()
  })
})
