import CustomDocument from '../entity/CustomDocument'

export default interface CustomDocumentRepository {
  save(customDocument: CustomDocument): Promise<void>
  getByOwnerCodeAndCustomDocumentTitle(
    ownerCode: string,
    customPaymentMethodTitle: string
  ): Promise<CustomDocument>
}
