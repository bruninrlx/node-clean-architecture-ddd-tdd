import Card from './Card'

export default class PaymentMethod {
  constructor(readonly name: string, readonly type: string, readonly card: Card) {}
}
