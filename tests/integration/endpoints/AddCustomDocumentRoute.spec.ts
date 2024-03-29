import { PrismaClient } from '@prisma/client'
import request from 'supertest'
import { http, server } from '@/main'
import SuccessView from '@/infra/presenters/SuccessView'
import CustomDocument from '@/domain/entity/CustomDocument'
import FailView from '@/infra/presenters/FailView'
import { InternalServerError } from '@/application/errors/errors'
import { HttpStatusCode } from '@/infra/http/HttpStatusCode'

describe('AddCustomDocumentController', () => {
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
    const customDocument = prisma.customDocument.deleteMany()
    const wallet = prisma.wallet.deleteMany()
    const owner = prisma.owner.deleteMany()
    await prisma.$transaction([customDocument, wallet, owner])
    await prisma.$disconnect()
    server.close()
  })

  it('should return a SuccessView with the correct status code and output data on success', async () => {
    const { status, body } = await request(http.app)
      .post('/custom-document')
      .query({ owner_code: 'any_owner_code' })
      .send({
        customDocumentName: 'any_custom_document_name',
        description: 'any_custom_description',
      })
    expect(status).toBe(201)
    expect(body).toEqual(
      new SuccessView(201, new CustomDocument('any_custom_document_name', 'any_custom_description'))
    )
  })

  it('should return a FailView with the correct status code and error data', async () => {
    const { status, body } = await request(http.app)
      .post('/custom-document')
      .query({ owner_code: 'wrong owner code' })
      .send({
        customDocumentName: 'any_custom_document_name',
        description: 'any_custom_description',
      })
    expect(status).toBe(400)
    expect(body).toEqual({
      status: 400,
      responseError: {
        code: 'P2003',
        clientVersion: '4.9.0',
        meta: { field_name: 'CustomDocument_owner_code_fkey (index)' },
      },
    })
  })
})
