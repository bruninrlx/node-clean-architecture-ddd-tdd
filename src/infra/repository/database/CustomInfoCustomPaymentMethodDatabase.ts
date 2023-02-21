import { NotFoundError } from '@/application/errors/errors'
import CustomInfo from '@/domain/entity/CustomInfo'
import CustomInfoCustomPaymentMethodRepository from '@/domain/repository/CustomInfoCustomPaymentMethodRepository'
import { PrismaClient } from '@prisma/client'

export class CustomInfoCustomPaymentMethodRepositoryDatabase
  implements CustomInfoCustomPaymentMethodRepository
{
  constructor(readonly prisma: PrismaClient) {}

  async save(
    ownerCode: string,
    customPaymentMethodName: string,
    customInfo: CustomInfo
  ): Promise<void> {
    const customPaymentMethod = await this.prisma.customPaymentMethod.findFirst({
      where: {
        owner_code: ownerCode,
        name: customPaymentMethodName,
      },
    })
    if (!customPaymentMethod) throw new NotFoundError('Custom payment method not found')
    await this.prisma.customInfo.create({
      data: {
        title: customInfo.title,
        info: customInfo.info,
        description: customInfo.description ?? '',
      },
    })
    await this.prisma.customInfoOnCustomPaymentMethods.create({
      data: {
        name_custom_payment_method: customPaymentMethodName,
        owner_code: ownerCode,
        title_custom_info: customInfo.title,
      },
    })
  }

  async getByOwnerCodeAndCustomPaymentMethodNameAndCustomInfoTtitle(
    ownerCode: string,
    customPaymentMethodName: string,
    customInfoTtitle: string
  ): Promise<CustomInfo> {
    const customInfo = await this.prisma.customInfo.findUnique({
      where: {
        title: customInfoTtitle,
      },
      include: {
        CustomInfoOnCustomPaymentMethods: {
          where: {
            owner_code: ownerCode,
            name_custom_payment_method: customPaymentMethodName,
            title_custom_info: customInfoTtitle,
          },
        },
      },
    })
    if (!customInfo) throw new NotFoundError('Custom info Not Found')
    return customInfo
  }
}
