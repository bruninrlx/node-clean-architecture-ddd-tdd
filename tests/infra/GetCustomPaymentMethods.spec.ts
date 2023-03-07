import { mock, MockProxy } from 'jest-mock-extended'
import SuccessView from '@/infra/presenters/SuccessView'
import { HttpStatusCode } from '@/infra/http/HttpStatusCode'
import { BadRequestError } from '@/application/errors/errors'
import FailView from '@/infra/presenters/FailView'
import GetCustomPaymentMethodsController from '@/infra/controller/GetCustomPaymentMethodsController'
import GetCustomPaymentMethods from '@/application/usecase/get-custom-payment-methods/GetCustomPaymentMethods'
import CustomInfo from '@/domain/entity/CustomInfo'
import CustomPaymentMethod from '@/domain/entity/CustomPaymentMethod'

describe('GetCustomPaymentMethodsController', () => {
  let getCustomPaymentMethods: MockProxy<GetCustomPaymentMethods>
  let sut: GetCustomPaymentMethodsController
  let ownerCode: string

  beforeEach(async () => {
    getCustomPaymentMethods = mock()
    ownerCode = 'any_owner_code'
    sut = new GetCustomPaymentMethodsController(getCustomPaymentMethods)
  })

  it('should return a SuccessView with the correct status code and output data on success', async () => {
    const paymentMethod = new CustomPaymentMethod(
      'any_custom_payment_method_name',
      'any_custom_payment_method_description'
    )
    const secondpaymentMethod = new CustomPaymentMethod(
      'any_custom_payment_method_name',
      'any_custom_payment_method_description'
    )
    paymentMethod.addCustomInfo(new CustomInfo('any_title', 'any_info', 'any_description'))
    getCustomPaymentMethods.execute.mockReturnValue(
      Promise.resolve([paymentMethod, secondpaymentMethod])
    )
    const output = await sut.execute(ownerCode)
    const successView = new SuccessView(HttpStatusCode.OK, [paymentMethod, secondpaymentMethod])
    expect(output).toEqual(successView)
  })

  it('should return a FailView with the correct status code and error data', async () => {
    const unauthorizedError = new BadRequestError('Error when tries to get custom payment methods')
    getCustomPaymentMethods.execute.mockRejectedValue(unauthorizedError)
    const output = await sut.execute(ownerCode)
    const failView = new FailView(HttpStatusCode.NotFound, unauthorizedError)
    expect(output).toEqual(failView)
  })
})
