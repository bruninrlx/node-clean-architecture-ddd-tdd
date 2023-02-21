import PaymentMethod from '../entity/PaymentMethod'

export default interface PaymentMethodRepository {
  save(owner_code: string, paymentMethod: PaymentMethod): Promise<void>
  getPaymentMethodsByOwnerCode(ownerCode: string): Promise<PaymentMethod[]>
}
