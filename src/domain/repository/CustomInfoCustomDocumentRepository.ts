import CustomInfo from '../entity/CustomInfo'

export default interface CustomInfoCustomDocumentRepository {
  save(ownerCode: string, customDocumentName: string, customInfo: CustomInfo): Promise<void>
  getByOwnerCodeAndCustomDocumentNameAndCustomInfoTtitle(
    ownerCode: string,
    customDocumentName: string,
    customInfoTtitle: string
  ): Promise<CustomInfo>
}
