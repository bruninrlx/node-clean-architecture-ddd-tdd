import CustomPaymentMethod from '../entity/CustomPaymentMethod'

export default interface CustomPaymentMethodRepository {
  save(ownerCode: string, customPaymentMethod: CustomPaymentMethod): Promise<void>
  getByOwnerCodeAndCustomPaymentMethodName(
    ownerCode: string,
    customPaymentMethodName: string
  ): Promise<CustomPaymentMethod>
  getCustomPaymentMethodsByOwnerCode(ownerCode: string): Promise<CustomPaymentMethod[]>
}
