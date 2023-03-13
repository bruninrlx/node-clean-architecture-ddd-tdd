import { PrismaClient } from '@prisma/client'
import request from 'supertest'
import { http, server } from '@/main'

describe('AddCustomInfoCustomDocumentController', () => {
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
    await prisma.customDocument.create({
      data: {
        owner_code: 'any_owner_code',
        name: 'any_custom_document_name',
        description: 'any_custom_document_description',
      },
    })
  })

  afterEach(async () => {
    const customInfoOnCustomDocuments = prisma.customInfoOnCustomDocuments.deleteMany()
    const customInfo = prisma.customInfo.deleteMany()
    const customDocument = prisma.customDocument.deleteMany()
    const wallet = prisma.wallet.deleteMany()
    const owner = prisma.owner.deleteMany()
    await prisma.$transaction([
      customInfoOnCustomDocuments,
      customInfo,
      customDocument,
      wallet,
      owner,
    ])
    await prisma.$disconnect()
    server.close()
  })

  it('should return a SuccessView with the correct status code and output data on success', async () => {
    const { status, body } = await request(http.app)
      .post('/custom-document-custom-info')
      .query({
        owner_code: 'any_owner_code',
        custom_document_name: 'any_custom_document_name',
        description: 'any_custom_document_description',
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
      .post('/custom-document-custom-info')
      .query({
        owner_code: 'any_owner_code',
        custom_document_name: 'wrong_custom_document_name',
        description: 'any_custom_document_description',
      })
      .send({
        title: 'title',
        info: 'info',
        description: 'description',
      })
    expect(status).toBe(500)
  })
})
