import { PrismaClient } from '@prisma/client'
import request from 'supertest'
import { http } from '@/main'

describe('AddCustomDocumentController', () => {
  let prisma: PrismaClient
  beforeEach(async () => {
    prisma = new PrismaClient()
    prisma.owner.create({
      data: {
        owner_code: 'any_owner_code',
        user_email: 'user_email',
        user_name: 'user_name',
      },
    })
    prisma.wallet.create({ data: { owner_code: 'any_owner_code' } })
  })

  afterEach(async () => {
    const customDocument = prisma.customDocument.deleteMany()
    const wallet = prisma.wallet.deleteMany()
    const owner = prisma.owner.deleteMany()
    await prisma.$transaction([customDocument, wallet, owner])
    await prisma.$disconnect()
  })

  it('should return a SuccessView with the correct status code and output data on success', async () => {
    const { status } = await request(http.app)
      .post('/custom-document')
      .query({ owner_code: 'any_owner_code' })
      .send({
        customDocumentName: 'any_custom_document_name',
        description: 'any_custom_description',
      })
  })

  it('should return a FailView with the correct status code and error data', async () => {})
})
