import Owner from '@/domain/entity/Owner'
import Wallet from '@/domain/entity/Wallet'
import Card from '@/domain/entity/Card'
import PaymentMethod from '@/domain/entity/PaymentMethod'
import CustomPaymentMethod from '@/domain/entity/CustomPaymentMethod'
import CustomInfo from '@/domain/entity/CustomInfo'
import CustomDocument from '@/domain/entity/CustomDocument'

describe('wallet', () => {
  let sut: Wallet
  enum PaymentType {
    BENEFIT = 'benefit',
    DEBIT = 'debit',
    CREDIT = 'credit',
  }

  beforeEach(() => {
    sut = new Wallet('any_owner_code')
  })

  it('Should add an payment method to wallet', () => {
    const card = new Card(
      'Murilo Castilho',
      'VISA',
      '4219611371562250',
      'Nu Pagamentos S.A',
      '186',
      '12/2022'
    )
    const paymentMethod = new PaymentMethod('my nubank credit card', PaymentType.CREDIT, card)
    sut.addPaymentMethod(paymentMethod)
    expect(sut.paymentMethods).toEqual([
      {
        name: 'my nubank credit card',
        type: PaymentType.CREDIT,
        card: {
          ownerName: 'Murilo Castilho',
          brand: 'VISA',
          cardNumber: '4219611371562250',
          bank: 'Nu Pagamentos S.A',
          cvv: '186',
          expiry: '12/2022',
        },
        customPaymentMethod: undefined,
      },
    ])
  })

  it('Should add an Custom payment method to wallet', () => {
    const customInfo = new CustomInfo(
      'minha chave pix',
      '15998204926',
      'chave pix necessária para receber transferencias'
    )
    const customPaymentMethod = new CustomPaymentMethod('pix', 'pagamento a vista')
    customPaymentMethod.addCustomInfo(customInfo)
    sut.addCustomPaymentMethod(customPaymentMethod)
    expect(sut.customPaymentMethods).toEqual([
      {
        name: 'pix',
        description: 'pagamento a vista',
        customInfos: [
          {
            title: 'minha chave pix',
            info: '15998204926',
            description: 'chave pix necessária para receber transferencias',
          },
        ],
      },
    ])
  })

  it('Should add an Custom document to wallet', () => {
    const customInfo = new CustomInfo(
      'Numero de identificação',
      '54244244-X',
      'numero de identificação registro geral'
    )
    const customDocument = new CustomDocument('RG', 'Documento de identidade')
    customDocument.addCustomInfo(customInfo)
    sut.addCustomDocument(customDocument)
    expect(sut.customDocuments).toEqual([
      {
        name: 'RG',
        description: 'Documento de identidade',
        customInfos: [
          {
            title: 'Numero de identificação',
            info: '54244244-X',
            description: 'numero de identificação registro geral',
          },
        ],
      },
    ])
  })
})
