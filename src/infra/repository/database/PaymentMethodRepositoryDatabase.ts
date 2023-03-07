import { PrismaClient } from '@prisma/client'
import CustomDocument from '@/domain/entity/CustomDocument'
import PaymentMethodRepository from '@/domain/repository/PaymentMethodRepository'
import PaymentMethod from '@/domain/entity/PaymentMethod'
import Card from '@/domain/entity/Card'
import { NotFoundError } from '@/application/errors/errors'

export class PaymentMethodRepositoryDatabase implements PaymentMethodRepository {
  constructor(readonly prisma: PrismaClient) {}

  async save(owner_code: string, paymentMethod: PaymentMethod): Promise<void> {
    await this.prisma.card.create({
      data: {
        owner_name: paymentMethod.card.ownerName,
        brand: paymentMethod.card.brand,
        card_number: paymentMethod.card.cardNumber,
        bank: paymentMethod.card.bank,
        cvv: paymentMethod.card.cvv,
        expiry: paymentMethod.card.expiry,
      },
    })

    await this.prisma.paymentMethod.create({
      data: {
        name: paymentMethod.name,
        type: paymentMethod.type,
        card_number: paymentMethod.card.cardNumber,
        owner_code: owner_code,
      },
    })
  }

  async getPaymentMethodsByOwnerCode(ownerCode: string): Promise<PaymentMethod[]> {
    const paymentMethodsFinded: PaymentMethod[] = []
    const paymentMethods = await this.prisma.paymentMethod.findMany({
      where: {
        owner_code: ownerCode,
      },
    })
    if (paymentMethods.length) {
      await Promise.all(
        paymentMethods.map(async (paymentMethod) => {
          const card = await this.prisma.card.findFirst({
            where: {
              card_number: paymentMethod.card_number,
            },
          })

          if (card)
            paymentMethodsFinded.push(
              new PaymentMethod(
                paymentMethod.name,
                paymentMethod.type,
                new Card(
                  card.owner_name,
                  card.brand,
                  card.card_number,
                  card.bank,
                  card.cvv,
                  card.expiry
                )
              )
            )
        })
      )
    }
    if (!paymentMethodsFinded.length) throw new NotFoundError('Payment methods not found')
    return paymentMethodsFinded
  }
}
