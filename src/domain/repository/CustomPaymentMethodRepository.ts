import CustomPaymentMethod from '../entity/CustomPaymentMethod'

export default interface CustomPaymentMethodRepository {
  save(customPaymentMethod: CustomPaymentMethod): Promise<void>
  getByOwnerCodeAndCustomPaymentMethodTitle(
    ownerCode: string,
    customPaymentMethodTitle: string
  ): Promise<CustomPaymentMethod>
}
