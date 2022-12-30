import CustomDocument from './CustomDocument'
import CustomPaymentMethod from './CustomPaymentMethod'
import Owner from './Owner'
import PaymentMethod from './PaymentMethod'

export default class Wallet {
  readonly paymentMethods: PaymentMethod[]
  readonly customPaymentMethods: CustomPaymentMethod[]
  readonly customDocuments: CustomDocument[]

  constructor(readonly ownerCode: string) {
    this.paymentMethods = []
    this.customPaymentMethods = []
    this.customDocuments = []
  }

  addPaymentMethod(paymentMethod: PaymentMethod) {
    this.paymentMethods.push(paymentMethod)
  }

  addCustomPaymentMethod(customPaymentMethod: CustomPaymentMethod) {
    this.customPaymentMethods.push(customPaymentMethod)
  }

  addCustomDocument(customDocument: CustomDocument) {
    this.customDocuments.push(customDocument)
  }
}
