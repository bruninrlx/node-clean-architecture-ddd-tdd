import Owner from '../entity/Owner'

export default interface OwnerRepository {
  save(owner: Owner): Promise<void>
  getByCode(ownerCode: string): Promise<Owner>
}
