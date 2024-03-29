export type Input = {
  ownerCode: string
  paymentMethod: {
    name: string
    type: string
    card: {
      ownerName: string
      brand: string
      cardNumber: string
      bank: string
      cvv: string
      expiry: string
    }
  }
}
