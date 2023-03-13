import { Input } from '@/application/usecase/add-custom-info-custom-payment-method/Input'
import AddCustomInfoPaymentMethodController from '@/infra/controller/AddCustomInfoPaymentMethodController'
import { mock, MockProxy } from 'jest-mock-extended'
import SuccessView from '@/infra/presenters/SuccessView'
import { HttpStatusCode } from '@/infra/http/HttpStatusCode'
import { BadRequestError, NotFoundError } from '@/application/errors/errors'
import FailView from '@/infra/presenters/FailView'
import AddCustomInfoCustomPaymentMethod from '@/application/usecase/add-custom-info-custom-payment-method/AddCustomInfoCustomPaymentMethod'
import CustomInfo from '@/domain/entity/CustomInfo'

describe('AddCustomInfoCustomPaymentMethodController', () => {
  let input: Input
  let addCustomInfoCustomPaymentMethod: MockProxy<AddCustomInfoCustomPaymentMethod>
  let sut: AddCustomInfoPaymentMethodController

  beforeEach(async () => {
    addCustomInfoCustomPaymentMethod = mock()
    input = {
      ownerCode: 'owner_code',
      customPaymentMethodName: 'custom_payment_method_name',
      description: 'description',
      customInfo: {
        title: 'title',
        info: 'info',
        description: 'description',
      },
    }
    sut = new AddCustomInfoPaymentMethodController(addCustomInfoCustomPaymentMethod)
  })

  it('should return a SuccessView with the correct status code and output data on success', async () => {
    const customInfo = new CustomInfo('title', 'info', 'description')
    addCustomInfoCustomPaymentMethod.execute.mockReturnValue(Promise.resolve(customInfo))
    const output = await sut.execute(input)
    const successView = new SuccessView(HttpStatusCode.Created, customInfo)
    expect(output).toEqual(successView)
  })

  it('should return a FailView with the correct status code and error data', async () => {
    const notFoundError = new NotFoundError(
      'Error when tries to save an custom info to an custom payment method'
    )
    addCustomInfoCustomPaymentMethod.execute.mockRejectedValue(notFoundError)
    const output = await sut.execute(input)
    const failView = new FailView(HttpStatusCode.NotFound, notFoundError)
    expect(output).toEqual(failView)
  })
})
