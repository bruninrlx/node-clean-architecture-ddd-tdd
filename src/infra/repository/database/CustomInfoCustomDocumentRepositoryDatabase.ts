import { NotFoundError } from '@/application/errors/errors'
import CustomInfo from '@/domain/entity/CustomInfo'
import CustomInfoCustomDocumentRepository from '@/domain/repository/CustomInfoCustomDocumentRepository'
import { PrismaClient } from '@prisma/client'

export class CustomInfoCustomDocumentRepositoryDatabase
  implements CustomInfoCustomDocumentRepository
{
  constructor(readonly prisma: PrismaClient) {}

  async save(ownerCode: string, customDocumentName: string, customInfo: CustomInfo): Promise<void> {
    const customDocument = await this.prisma.customDocument.findFirst({
      where: {
        owner_code: ownerCode,
        name: customDocumentName,
      },
    })
    if (!customDocument) throw new NotFoundError('Custom document not found')
    await this.prisma.customInfo.create({
      data: {
        title: customInfo.title,
        info: customInfo.info,
        description: customInfo.description ?? '',
      },
    })
    await this.prisma.customInfoOnCustomDocuments.create({
      data: {
        custom_document_name: customDocumentName,
        owner_code: ownerCode,
        title_custom_info: customInfo.title,
      },
    })
  }

  async getByOwnerCodeAndCustomDocumentNameAndCustomInfoTtitle(
    ownerCode: string,
    customDocumentName: string,
    customInfoTtitle: string
  ): Promise<CustomInfo> {
    const customInfo = await this.prisma.customInfo.findUnique({
      where: {
        title: customInfoTtitle,
      },
      include: {
        CustomInfoOnCustomDocuments: {
          where: {
            owner_code: ownerCode,
            custom_document_name: customDocumentName,
            title_custom_info: customInfoTtitle,
          },
        },
      },
    })
    if (!customInfo) throw new NotFoundError('Custom info Not Found')
    return customInfo
  }
}
