import { Input } from '@/application/usecase/add-custom-payment-method/Input'
import { mock, MockProxy } from 'jest-mock-extended'
import SuccessView from '@/infra/presenters/SuccessView'
import { HttpStatusCode } from '@/infra/http/HttpStatusCode'
import { InternalServerError } from '@/application/errors/errors'
import FailView from '@/infra/presenters/FailView'
import AddCustomPaymentMethodController from '@/infra/controller/AddCustomPaymentMethodController'
import AddCustomPaymentMethod from '@/application/usecase/add-custom-payment-method/AddCustomPaymentMethod'
import CustomPaymentMethod from '@/domain/entity/CustomPaymentMethod'

describe('AddCustomPaymentMethodController', () => {
  let input: Input
  let addCustomPaymentMethod: MockProxy<AddCustomPaymentMethod>
  let sut: AddCustomPaymentMethodController

  beforeEach(async () => {
    addCustomPaymentMethod = mock()
    input = {
      ownerCode: 'any_owner_code',
      customPaymentMethodName: 'any_custom_payment_method',
      description: 'any_description',
    }
    sut = new AddCustomPaymentMethodController(addCustomPaymentMethod)
  })

  it('should return a SuccessView with the correct status code and output data on success', async () => {
    const customPaymentMethod = new CustomPaymentMethod(
      'any_custom_payment_method_name',
      'any_custom_payment_method_description'
    )
    addCustomPaymentMethod.execute.mockReturnValue(Promise.resolve(customPaymentMethod))
    const output = await sut.execute(input)
    const successView = new SuccessView(HttpStatusCode.Created, customPaymentMethod)
    expect(output).toEqual(successView)
  })

  it('should return a FailView with the correct status code and error data', async () => {
    const unauthorizedError = new InternalServerError(
      'Error when tries to save an custom payment method'
    )
    addCustomPaymentMethod.execute.mockRejectedValue(unauthorizedError)
    const output = await sut.execute(input)
    const failView = new FailView(HttpStatusCode.InternalServerError, unauthorizedError)
    expect(output).toEqual(failView)
  })
})
