import { mock, MockProxy } from 'jest-mock-extended'
import SuccessView from '@/infra/presenters/SuccessView'
import { HttpStatusCode } from '@/infra/http/HttpStatusCode'
import { BadRequestError } from '@/application/errors/errors'
import FailView from '@/infra/presenters/FailView'
import GetPaymentMethods from '@/application/usecase/get-payment-methods/GetPaymentMethods'
import GetPaymentMethodsController from '@/infra/controller/GetPaymentMethodsController'
import PaymentMethod from '@/domain/entity/PaymentMethod'
import Card from '@/domain/entity/Card'

describe('GetPaymentMethodsController', () => {
  let getPaymentMethods: MockProxy<GetPaymentMethods>
  let sut: GetPaymentMethodsController
  let ownerCode: string

  beforeEach(async () => {
    getPaymentMethods = mock()
    ownerCode = 'any_owner_code'
    sut = new GetPaymentMethodsController(getPaymentMethods)
  })

  it('should return a SuccessView with the correct status code and output data on success', async () => {
    const paymentMethod = new PaymentMethod(
      'any_payment_method',
      'any_type',
      new Card('any_name', 'any_brand', 'any_cardNumber', 'any_bank', 'any_cvv', 'any_expiry')
    )
    const secondpaymentMethod = new PaymentMethod(
      'any_second_payment_method',
      'any_type',
      new Card('any_name', 'any_brand', 'any_cardNumber', 'any_bank', 'any_cvv', 'any_expiry')
    )
    getPaymentMethods.execute.mockReturnValue(Promise.resolve([paymentMethod, secondpaymentMethod]))
    const output = await sut.execute(ownerCode)
    const successView = new SuccessView(HttpStatusCode.OK, [paymentMethod, secondpaymentMethod])
    expect(output).toEqual(successView)
  })

  it('should return a FailView with the correct status code and error data', async () => {
    const unauthorizedError = new BadRequestError('Error when tries to get payment methods')
    getPaymentMethods.execute.mockRejectedValue(unauthorizedError)
    const output = await sut.execute(ownerCode)
    const failView = new FailView(HttpStatusCode.NotFound, unauthorizedError)
    expect(output).toEqual(failView)
  })
})
