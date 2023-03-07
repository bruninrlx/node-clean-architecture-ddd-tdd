import { PrismaClient } from '@prisma/client'
import CustomDocumentRepository from '@/domain/repository/CustomDocumentRepository'
import CustomDocument from '@/domain/entity/CustomDocument'
import { NotFoundError } from '@/application/errors/errors'
import CustomInfo from '@/domain/entity/CustomInfo'

export class CustomDocumentRepositoryDatabase implements CustomDocumentRepository {
  constructor(readonly prisma: PrismaClient) {}

  async save(ownerCode: string, customDocument: CustomDocument): Promise<void> {
    console.log(ownerCode, customDocument)
    await this.prisma.customDocument.create({
      data: {
        name: customDocument.name,
        description: customDocument.description,
        owner_code: ownerCode,
      },
    })
    console.log('teste kkkkkkkk')
  }

  async getByOwnerCodeAndCustomDocumentName(
    ownerCode: string,
    customDocumentName: string
  ): Promise<CustomDocument> {
    const customDocumentPrisma = await this.prisma.customDocument.findFirst({
      where: {
        owner_code: ownerCode,
        name: customDocumentName,
      },
    })
    if (!customDocumentPrisma) throw new NotFoundError('Custom document not found')
    return new CustomDocument(customDocumentPrisma.name, customDocumentPrisma.description)
  }

  async getCustomDocumentsByOwnerCoder(ownerCode: string): Promise<CustomDocument[]> {
    const customDocumentsPrisma = await this.prisma.customDocument.findMany({
      where: {
        owner_code: ownerCode,
      },
      include: {
        CustomInfoOnCustomDocuments: {
          select: {
            CustomInfo: true,
          },
        },
      },
    })
    if (!customDocumentsPrisma.length) throw new NotFoundError('no Custom documents were found.')
    const formattedCustomDocuments = customDocumentsPrisma.map((customDocumentPrisma) => {
      if (!customDocumentPrisma.CustomInfoOnCustomDocuments.length) {
        throw new NotFoundError(
          `O CustomDocument "${customDocumentPrisma.name}" não possui nenhum CustomInfo relacionado.`
        )
      }
      const customDocument = new CustomDocument(
        customDocumentPrisma.name,
        customDocumentPrisma.description
      )
      customDocumentPrisma.CustomInfoOnCustomDocuments.forEach((customInfo) =>
        customDocument.addCustomInfo(
          new CustomInfo(
            customInfo.CustomInfo.title,
            customInfo.CustomInfo.info,
            customInfo.CustomInfo.description
          )
        )
      )
      return customDocument
    })
    return formattedCustomDocuments
  }
}
