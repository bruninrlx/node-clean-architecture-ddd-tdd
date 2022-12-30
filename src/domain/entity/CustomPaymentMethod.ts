import CustomInfo from './CustomInfo'

export default class CustomPaymentMethod {
  readonly customInfos: CustomInfo[]

  constructor(readonly name: string, readonly description: string) {
    this.customInfos = []
  }

  addCustomInfo(customInfo: CustomInfo) {
    const hasDuplicatedCustomInfo = this.customInfos.some(
      (customInfo) => customInfo.title === customInfo.title
    )
    if (hasDuplicatedCustomInfo)
      throw new Error('O método de pagamento já possui essa informação cadastrada')
    this.customInfos.push(customInfo)
  }
}
