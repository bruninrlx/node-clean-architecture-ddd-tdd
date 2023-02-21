import CustomInfo from '../entity/CustomInfo'

export default interface CustomInfoCustomPaymentMethodRepository {
  save(ownerCode: string, customPaymentTitle: string, customInfo: CustomInfo): Promise<void>
  getByOwnerCodeAndCustomPaymentMethodNameAndCustomInfoTtitle(
    ownerCode: string,
    customPaymentMethodName: string,
    customInfoTtitle: string
  ): Promise<CustomInfo>
}
