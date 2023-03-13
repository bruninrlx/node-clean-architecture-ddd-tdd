import { PrismaClient } from '@prisma/client'
import request from 'supertest'
import { http, server } from '@/main'
import SuccessView from '@/infra/presenters/SuccessView'
import PaymentMethod from '@/domain/entity/PaymentMethod'

describe('AddPaymentMethodController', () => {
  let prisma: PrismaClient
  beforeEach(async () => {
    prisma = new PrismaClient()
    await prisma.owner.create({
      data: {
        owner_code: 'any_owner_code',
        user_email: 'user_email',
        user_name: 'user_name',
      },
    })
    await prisma.wallet.create({ data: { owner_code: 'any_owner_code' } })
  })

  afterEach(async () => {
    const paymentMethod = prisma.paymentMethod.deleteMany()
    const wallet = prisma.wallet.deleteMany()
    const owner = prisma.owner.deleteMany()
    await prisma.$transaction([paymentMethod, wallet, owner])
    await prisma.$disconnect()
    server.close()
  })

  it('should return a SuccessView with the correct status code and output data on success', async () => {
    const { status, body } = await request(http.app)
      .post('/payment-method')
      .query({ owner_code: 'any_owner_code' })
      .send({
        name: 'any_payment_method',
        type: 'any_type',
        card: {
          ownerName: 'any_name',
          brand: 'any_brand',
          cardNumber: 'any_cardNumber',
          bank: 'any_bank',
          cvv: 'any_cvv',
          expiry: 'any_expiry',
        },
      })
    expect(status).toBe(201)
    expect(body).toEqual(
      new SuccessView(
        201,
        new PaymentMethod('any_payment_method', 'any_type', {
          ownerName: 'any_name',
          brand: 'any_brand',
          cardNumber: 'any_cardNumber',
          bank: 'any_bank',
          cvv: 'any_cvv',
          expiry: 'any_expiry',
        })
      )
    )
  })

  it('should return a FailView with the correct status code and error data', async () => {
    const { status } = await request(http.app)
      .post('/payment-method')
      .query({ owner_code: 'any_owner_code' })
      .send({
        name: 'any_payment_method',
        type: 'any_type',
        card: {
          ownerName: 'any_name',
          brand: 'any_brand',
          cardNumber: 'any_cardNumber',
          bank: 'any_bank',
          cvv: 'any_cvv',
          expiry: 'any_expiry',
        },
      })
    expect(status).toBe(500)
  })
})
