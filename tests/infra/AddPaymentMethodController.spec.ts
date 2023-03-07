import { Input } from '@/application/usecase/add-payment-method/Input'
import { mock, MockProxy } from 'jest-mock-extended'
import SuccessView from '@/infra/presenters/SuccessView'
import { HttpStatusCode } from '@/infra/http/HttpStatusCode'
import { InternalServerError } from '@/application/errors/errors'
import FailView from '@/infra/presenters/FailView'
import AddPaymentMethodController from '@/infra/controller/AddPaymentMethodController'
import AddPaymentMethod from '@/application/usecase/add-payment-method/AddPaymentMethod'
import PaymentMethod from '@/domain/entity/PaymentMethod'
import Card from '@/domain/entity/Card'

describe('AddPaymentMethodController', () => {
  let input: Input
  let addPaymentMethod: MockProxy<AddPaymentMethod>
  let sut: AddPaymentMethodController

  beforeEach(async () => {
    addPaymentMethod = mock()
    input = {
      ownerCode: 'any_owner_code',
      paymentMethod: {
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
      },
    }
    sut = new AddPaymentMethodController(addPaymentMethod)
  })

  it('should return a SuccessView with the correct status code and output data on success', async () => {
    const paymentMethod = new PaymentMethod(
      'any_payment_method',
      'any_type',
      new Card('any_name', 'any_brand', 'any_cardNumber', 'any_bank', 'any_cvv', 'any_expiry')
    )
    addPaymentMethod.execute.mockReturnValue(Promise.resolve(paymentMethod))
    const output = await sut.execute(input)
    const successView = new SuccessView(HttpStatusCode.Created, paymentMethod)
    expect(output).toEqual(successView)
  })

  it('should return a FailView with the correct status code and error data', async () => {
    const unauthorizedError = new InternalServerError('Error when tries to save an payment method')
    addPaymentMethod.execute.mockRejectedValue(unauthorizedError)
    const output = await sut.execute(input)
    const failView = new FailView(HttpStatusCode.InternalServerError, unauthorizedError)
    expect(output).toEqual(failView)
  })
})
