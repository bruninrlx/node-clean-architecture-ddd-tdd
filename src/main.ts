import { PrismaClient } from '@prisma/client'
import AddCustomDocument from './application/usecase/add-custom-document/AddCustomDocument'
import AddCustomInfoCustomDocument from './application/usecase/add-custom-info-custom-document/AddCustomInfoCustomDocument'
import AddCustomInfoCustomPaymentMethod from './application/usecase/add-custom-info-custom-payment-method/AddCustomInfoCustomPaymentMethod'
import AddCustomPaymentMethod from './application/usecase/add-custom-payment-method/AddCustomPaymentMethod'
import AddPaymentMethod from './application/usecase/add-payment-method/AddPaymentMethod'
import GetCustomDocuments from './application/usecase/get-custom-documents/GetCustomDocuments'
import GetCustomPaymentMethods from './application/usecase/get-custom-payment-methods/GetCustomPaymentMethods'
import GetPaymentMethods from './application/usecase/get-payment-methods/GetPaymentMethods'
import GetWallet from './application/usecase/get-wallet/GetWallet'
import AddCustomDocumentController from './infra/controller/AddCustomDocumentController'
import AddCustomInfoCustomDocumentController from './infra/controller/AddCustomInfoCustomDocumentController'
import AddCustomInfoCustomPaymentMethodController from './infra/controller/AddCustomInfoPaymentMethodController'
import AddCustomPaymentMethodController from './infra/controller/AddCustomPaymentMethodController'
import AddPaymentMethodController from './infra/controller/AddPaymentMethodController'
import GetCustomDocumentsController from './infra/controller/GetCustomDocumentsController'
import GetCustomPaymentMethodController from './infra/controller/GetCustomPaymentMethodsController'
import GetPaymentMethodsController from './infra/controller/GetPaymentMethodsController'
import GetWalletController from './infra/controller/GetWalletController'
import DatabaseRepositoryFactory from './infra/factory/DatabaseRepositoryFactory'
import ExpressHttp from './infra/http/ExpressHttp'
import Router from './infra/http/Routes'
const repositoryFactory = new DatabaseRepositoryFactory(new PrismaClient())
const addCustomDocument = new AddCustomDocument(repositoryFactory)
const addCustomInfoCustomDocument = new AddCustomInfoCustomDocument(repositoryFactory)
const addCustomInfoCustomPaymentMethod = new AddCustomInfoCustomPaymentMethod(repositoryFactory)
const addCustomPaymentMethod = new AddCustomPaymentMethod(repositoryFactory)
const addPaymentMethod = new AddPaymentMethod(repositoryFactory)
const getCustomDocuments = new GetCustomDocuments(repositoryFactory)
const getCustomPaymentMethods = new GetCustomPaymentMethods(repositoryFactory)
const getPaymentMethods = new GetPaymentMethods(repositoryFactory)
const getWallet = new GetWallet(repositoryFactory)
export const http = new ExpressHttp()
new Router(
  http,
  new AddCustomDocumentController(addCustomDocument),
  new GetCustomDocumentsController(getCustomDocuments),
  new AddCustomInfoCustomDocumentController(addCustomInfoCustomDocument),
  new AddCustomPaymentMethodController(addCustomPaymentMethod),
  new GetCustomPaymentMethodController(getCustomPaymentMethods),
  new AddCustomInfoCustomPaymentMethodController(addCustomInfoCustomPaymentMethod),
  new AddPaymentMethodController(addPaymentMethod),
  new GetPaymentMethodsController(getPaymentMethods),
  new GetWalletController(getWallet)
)
export const server = http.listen(process.env.PORT ?? 3002)
