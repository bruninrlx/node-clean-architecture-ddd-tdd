export default class Card {
  constructor(
    readonly ownerName: string,
    readonly brand: string,
    readonly cardNumber: string,
    readonly bank: string,
    readonly cvv: string,
    readonly expiry: string
  ) {}
}
