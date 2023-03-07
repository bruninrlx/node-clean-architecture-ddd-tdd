import { mock, MockProxy } from 'jest-mock-extended'
import SuccessView from '@/infra/presenters/SuccessView'
import { HttpStatusCode } from '@/infra/http/HttpStatusCode'
import { BadRequestError } from '@/application/errors/errors'
import FailView from '@/infra/presenters/FailView'
import PaymentMethod from '@/domain/entity/PaymentMethod'
import Card from '@/domain/entity/Card'
import GetWalletController from '@/infra/controller/GetWalletController'
import GetWallet from '@/application/usecase/get-wallet/GetWallet'
import CustomDocument from '@/domain/entity/CustomDocument'
import CustomPaymentMethod from '@/domain/entity/CustomPaymentMethod'
import Wallet from '@/domain/entity/Wallet'

describe('GetPaymentMethodsController', () => {
  let getWallet: MockProxy<GetWallet>
  let sut: GetWalletController
  let ownerCode: string

  beforeEach(async () => {
    getWallet = mock()
    ownerCode = 'any_owner_code'
    sut = new GetWalletController(getWallet)
  })

  it('should return a SuccessView with the correct status code and output data on success', async () => {
    const wallet = new Wallet(ownerCode)
    const paymentMethod = new PaymentMethod(
      'any_payment_method',
      'any_type',
      new Card('any_name', 'any_brand', 'any_cardNumber', 'any_bank', 'any_cvv', 'any_expiry')
    )
    const customDocument = new CustomDocument('any_custom_document', 'any_custom_description')
    const customPaymentMethod = new CustomPaymentMethod(
      'any_custom_payment_method',
      'any_custom_payment_method'
    )
    wallet.addPaymentMethod(paymentMethod)
    wallet.addCustomDocument(customDocument)
    wallet.addCustomPaymentMethod(customPaymentMethod)
    getWallet.execute.mockReturnValue(Promise.resolve(wallet))
    const output = await sut.execute(ownerCode)
    const successView = new SuccessView(HttpStatusCode.OK, wallet)
    expect(output).toEqual(successView)
  })

  it('should return a FailView with the correct status code and error data', async () => {
    const unauthorizedError = new BadRequestError('Error when tries to save an payment method')
    getWallet.execute.mockRejectedValue(unauthorizedError)
    const output = await sut.execute(ownerCode)
    const failView = new FailView(HttpStatusCode.NotFound, unauthorizedError)
    expect(output).toEqual(failView)
  })
})
