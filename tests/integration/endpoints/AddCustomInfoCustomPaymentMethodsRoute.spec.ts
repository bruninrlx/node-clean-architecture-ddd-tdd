import { PrismaClient } from '@prisma/client'
import request from 'supertest'
import { http, server } from '@/main'

describe('AddCustomInfoCustomPaymentMethodController', () => {
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
    await prisma.customPaymentMethod.create({
      data: {
        owner_code: 'any_owner_code',
        name: 'any_custom_payment_method_name',
        description: 'any_custom_payment_method_description',
      },
    })
  })

  afterEach(async () => {
    const customInfoOnCustomPaymentMethods = prisma.customInfoOnCustomPaymentMethods.deleteMany()
    const customInfo = prisma.customInfo.deleteMany()
    const customPaymentMethod = prisma.customPaymentMethod.deleteMany()
    const wallet = prisma.wallet.deleteMany()
    const owner = prisma.owner.deleteMany()
    await prisma.$transaction([
      customInfoOnCustomPaymentMethods,
      customInfo,
      customPaymentMethod,
      wallet,
      owner,
    ])
    await prisma.$disconnect()
    server.close()
  })

  it('should return a SuccessView with the correct status code and output data on success', async () => {
    const { status, body } = await request(http.app)
      .post('/custom-payment-method-custom-info')
      .query({
        owner_code: 'any_owner_code',
        custom_payment_method_name: 'any_custom_payment_method_name',
        description: 'any_custom_payment_method_description',
      })
      .send({
        title: 'title',
        info: 'info',
        description: 'description',
      })
    expect(status).toBe(201)
  })

  it('should return a FailView with the correct status code and error data', async () => {
    const { status } = await request(http.app)
      .post('/custom-payment_method-custom-info')
      .query({
        owner_code: 'any_owner_code',
        custom_payment_method_name: 'wrong_custom_payment_method_name',
        description: 'any_custom_payment_method_description',
      })
      .send({
        title: 'title',
        info: 'info',
        description: 'description',
      })
    expect(status).toBe(404)
  })
})
