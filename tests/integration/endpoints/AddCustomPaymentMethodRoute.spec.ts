import { PrismaClient } from '@prisma/client'
import request from 'supertest'
import { http, server } from '@/main'
import SuccessView from '@/infra/presenters/SuccessView'
import CustomPaymentMethod from '@/domain/entity/CustomPaymentMethod'

describe('AddCustomPaymentMethodController', () => {
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
    const customPaymentMethod = prisma.customPaymentMethod.deleteMany()
    const wallet = prisma.wallet.deleteMany()
    const owner = prisma.owner.deleteMany()
    await prisma.$transaction([customPaymentMethod, wallet, owner])
    await prisma.$disconnect()
    server.close()
  })

  it('should return a SuccessView with the correct status code and output data on success', async () => {
    const { status, body } = await request(http.app)
      .post('/custom-payment-method')
      .query({ owner_code: 'any_owner_code' })
      .send({
        customPaymentMethodName: 'any_custom_payment_method_name',
        description: 'any_custom_description',
      })
    expect(status).toBe(201)
    expect(body).toEqual(
      new SuccessView(
        201,
        new CustomPaymentMethod('any_custom_payment_method_name', 'any_custom_description')
      )
    )
  })

  it('should return a FailView with the correct status code and error data', async () => {
    const { status } = await request(http.app)
      .post('/custom-payment-method')
      .query({ owner_code: 'wrong owner code' })
      .send({
        customPaymentMethod: 'any_custom_payment_method_name',
        description: 'any_custom_description',
      })
    expect(status).toBe(500)
  })
})
