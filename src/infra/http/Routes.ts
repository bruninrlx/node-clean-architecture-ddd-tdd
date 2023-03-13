import AddCustomDocumentController from '../controller/AddCustomDocumentController'
import AddCustomInfoCustomDocumentController from '../controller/AddCustomInfoCustomDocumentController'
import AddCustomInfoCustomPaymentMethodController from '../controller/AddCustomInfoPaymentMethodController'
import AddCustomPaymentMethodController from '../controller/AddCustomPaymentMethodController'
import AddPaymentMethodController from '../controller/AddPaymentMethodController'
// import CreateWalletController from '../controller/CreateWalletController'
import GetCustomDocumentsController from '../controller/GetCustomDocumentsController'
import GetCustomPaymentMethodController from '../controller/GetCustomPaymentMethodsController'
import GetPaymentMethodsController from '../controller/GetPaymentMethodsController'
import GetWalletController from '../controller/GetWalletController'
import HttpServer from '../http/HttpServer'

export default class Router {
  constructor(
    readonly httpServer: HttpServer,
    readonly addCustomDocumentController: AddCustomDocumentController,
    readonly getCustomDocumentsController: GetCustomDocumentsController,
    readonly addCustomInfoCustomDocumentController: AddCustomInfoCustomDocumentController,
    readonly addCustomPaymentMethodController: AddCustomPaymentMethodController,
    readonly getCustomPaymentMethodController: GetCustomPaymentMethodController,
    readonly addCustomInfoCustomPaymentMethodController: AddCustomInfoCustomPaymentMethodController,
    readonly addPaymentMethodController: AddPaymentMethodController,
    readonly getPaymentMethodsController: GetPaymentMethodsController,
    readonly getWalletController: GetWalletController // readonly createWalletController: CreateWalletController
  ) {
    httpServer.on('post', '/custom-document', async (params: any, body: any) =>
      this.addCustomDocumentController.execute({
        ownerCode: params.owner_code,
        ...body,
      })
    )

    httpServer.on('get', '/custom-document', (params: any, _body: any) =>
      this.getCustomDocumentsController.execute(params.owner_code)
    )

    httpServer.on('post', '/custom-document-custom-info', (params: any, body: any) =>
      this.addCustomInfoCustomDocumentController.execute({
        ownerCode: params.owner_code,
        customDocumentName: params.custom_document_name,
        description: params.description,
        customInfo: body,
      })
    )

    httpServer.on('post', '/custom-payment-method', (params: any, body: any) =>
      this.addCustomPaymentMethodController.execute({
        ownerCode: params.owner_code,
        ...body,
      })
    )

    httpServer.on('get', '/custom-payment-method', (params: any, _body: any) =>
      this.getCustomPaymentMethodController.execute(params.owner_code)
    )

    httpServer.on('post', '/custom-payment-method-custom-info', (params: any, body: any) =>
      this.addCustomInfoCustomPaymentMethodController.execute({
        ownerCode: params.owner_code,
        customPaymentMethodName: params.custom_payment_method_name,
        description: params.description,
        customInfo: body,
      })
    )

    httpServer.on('post', '/payment-method', (params: any, body: any) =>
      this.addPaymentMethodController.execute({
        ownerCode: params.owner_code,
        paymentMethod: body,
      })
    )

    httpServer.on('get', '/payment-method', (params: any, _body: any) =>
      this.getPaymentMethodsController.execute(params.owner_code)
    )
  }
}
