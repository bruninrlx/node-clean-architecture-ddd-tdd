import CustomDocument from '../entity/CustomDocument'

export default interface CustomDocumentRepository {
  save(ownerCode: string, customDocument: CustomDocument): Promise<void>
  getByOwnerCodeAndCustomDocumentName(
    ownerCode: string,
    customDocumentName: string
  ): Promise<CustomDocument>
  getCustomDocumentsByOwnerCoder(ownerCode: string): Promise<CustomDocument[]>
}
