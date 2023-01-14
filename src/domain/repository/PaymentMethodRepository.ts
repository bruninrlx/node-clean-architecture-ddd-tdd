import PaymentMethod from '../entity/PaymentMethod'

export default interface PaymentMethodRepository {
  save(paymentMethod: PaymentMethod): Promise<void>
}
