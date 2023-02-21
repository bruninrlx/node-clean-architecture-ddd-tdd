import CustomDocument from '@/domain/entity/CustomDocument'
import CustomPaymentMethod from '@/domain/entity/CustomPaymentMethod'
import PaymentMethod from '@/domain/entity/PaymentMethod'

export type Output = {
  paymentMethods: PaymentMethod[] | []
  customPaymentMethods: CustomPaymentMethod[] | []
  customDocuments: CustomDocument[]
}
