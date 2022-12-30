import CustomPaymentMethod from '@/domain/entity/CustomPaymentMethod'
import CustomInfo from '@/domain/entity/CustomInfo'
import CustomDocument from '@/domain/entity/CustomDocument'

describe('CustomDocument', () => {
  let sut: CustomDocument

  beforeEach(() => {
    sut = new CustomDocument('any_name', 'any_description')
  })

  it('Should add an CustomInfo to an CustomDocument', () => {
    sut.addCustomInfo(new CustomInfo('RG', '54244244-X', 'Documento de identidade'))
    expect(sut.customInfos).toEqual([
      {
        title: 'RG',
        info: '54244244-X',
        description: 'Documento de identidade',
      },
    ])
  })

  it('Should throw an error when tries to add an customInfo with the same title', () => {
    sut.addCustomInfo(new CustomInfo('RG', '54244244-X', 'Documento de identidade'))
    const duplicatedCustomInfo = new CustomInfo('RG', '54244244-X', 'Documento de identidade')
    const error = new Error('O documento já possui essa informação cadastrada')
    expect(() => sut.addCustomInfo(duplicatedCustomInfo)).toThrow(error)
  })
})
