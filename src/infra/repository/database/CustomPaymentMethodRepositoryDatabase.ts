import { PrismaClient } from '@prisma/client'
import CustomPaymentMethodRepository from '@/domain/repository/CustomPaymentMethodRepository'
import CustomPaymentMethod from '@/domain/entity/CustomPaymentMethod'
import { NotFoundError } from '@/application/errors/errors'
import CustomInfo from '@/domain/entity/CustomInfo'

export class CustomPaymentMethodRepositoryDatabase implements CustomPaymentMethodRepository {
  constructor(readonly prisma: PrismaClient) {}

  async save(ownerCode: string, customPaymentMethod: CustomPaymentMethod): Promise<void> {
    await this.prisma.customPaymentMethod.create({
      data: {
        name: customPaymentMethod.name,
        description: customPaymentMethod.description,
        owner_code: ownerCode,
      },
    })
  }

  async getByOwnerCodeAndCustomPaymentMethodName(
    ownerCode: string,
    customPaymentMethodName: string
  ): Promise<CustomPaymentMethod> {
    const customPaymentMethodPrisma = await this.prisma.customPaymentMethod.findFirst({
      where: {
        owner_code: ownerCode,
        name: customPaymentMethodName,
      },
    })
    if (!customPaymentMethodPrisma) throw new NotFoundError('Custom payment method not found')
    return new CustomPaymentMethod(
      customPaymentMethodPrisma.name,
      customPaymentMethodPrisma.description
    )
  }

  async getCustomPaymentMethodsByOwnerCode(ownerCode: string): Promise<CustomPaymentMethod[]> {
    const customPaymentMethodsPrisma = await this.prisma.customPaymentMethod.findMany({
      where: {
        owner_code: ownerCode,
      },
      include: {
        CustomInfoOnCustomPaymentMethods: {
          select: {
            CustomInfo: true,
          },
        },
      },
    })
    if (!customPaymentMethodsPrisma.length) throw new NotFoundError('no Csnts were found.')
    const formattedCustomPaymentMethods = customPaymentMethodsPrisma.map(
      (customPaymentMethodPrisma) => {
        if (!customPaymentMethodPrisma.CustomInfoOnCustomPaymentMethods.length) {
          throw new NotFoundError(
            `O CustomDocument "${customPaymentMethodPrisma.name}" não possui nenhum CustomInfo relacionado.`
          )
        }
        const customPaymentMethod = new CustomPaymentMethod(
          customPaymentMethodPrisma.name,
          customPaymentMethodPrisma.description
        )
        customPaymentMethodPrisma.CustomInfoOnCustomPaymentMethods.forEach((customInfo) =>
          customPaymentMethod.addCustomInfo(
            new CustomInfo(
              customInfo.CustomInfo.title,
              customInfo.CustomInfo.info,
              customInfo.CustomInfo.description
            )
          )
        )
        return customPaymentMethod
      }
    )
    return formattedCustomPaymentMethods
  }
}
