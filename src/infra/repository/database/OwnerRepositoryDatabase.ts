import { NotFoundError } from '@/application/errors/errors'
import Owner from '@/domain/entity/Owner'
import OwnerRepository from '@/domain/repository/OwnerRepository'
import { PrismaClient } from '@prisma/client'

export class OwnerRepositoryDatabase implements OwnerRepository {
  constructor(readonly prisma: PrismaClient) {}
  async save(owner: Owner): Promise<void> {
    await this.prisma.owner.create({
      data: {
        owner_code: owner.ownerCode,
        user_email: owner.userEmail,
        user_name: owner.userName,
      },
    })
  }
  async getByCode(ownerCode: string): Promise<Owner> {
    const owner = await this.prisma.owner.findUnique({
      where: {
        owner_code: ownerCode,
      },
    })
    if (!owner) throw new NotFoundError('Owner not found')
    return new Owner(owner.owner_code, owner.user_email, owner.user_name)
  }
}
