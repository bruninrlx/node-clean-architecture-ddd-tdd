import CustomPaymentMethod from '@/domain/entity/CustomPaymentMethod'
import CustomInfo from '@/domain/entity/CustomInfo'

describe('CustomPaymentMethod', () => {
  let sut: CustomPaymentMethod

  beforeEach(() => {
    sut = new CustomPaymentMethod('any_name', 'any_description')
  })

  it('Should add an CustomInfo to an CustomPaymentMethod', () => {
    sut.addCustomInfo(
      new CustomInfo('pix', '15998204926', 'chave pix necessária para receber transferencias')
    )
    expect(sut.customInfos).toEqual([
      {
        title: 'pix',
        info: '15998204926',
        description: 'chave pix necessária para receber transferencias',
      },
    ])
  })

  it('Should throw an error when tries to add an customInfo with the same title', () => {
    sut.addCustomInfo(
      new CustomInfo('pix', '15998204926', 'chave pix necessária para receber transferencias')
    )
    const duplicatedCustomInfo = new CustomInfo(
      'pix',
      '15998204926',
      'chave pix necessária para receber transferencias'
    )
    const error = new Error('O método de pagamento já possui essa informação cadastrada')
    expect(() => sut.addCustomInfo(duplicatedCustomInfo)).toThrow(error)
  })
})
