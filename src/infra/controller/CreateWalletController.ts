import { InternalServerError } from '@/application/errors/errors'
import FailView from '../presenters/FailView'
import SuccessView from '../presenters/SuccessView'
import CreateWallet from '@/application/usecase/create-wallet/CreateWallet'
import { HttpStatusCode } from '../http/HttpStatusCode'

export default class CreateWalletController {
  constructor(readonly createWallet: CreateWallet) {}

  async execute(): Promise<SuccessView<{ message: string }> | FailView> {
    try {
      this.createWallet.execute()
      return new SuccessView(HttpStatusCode.Created, { message: 'wallet created' })
    } catch (error) {
      if (error instanceof Error) return new FailView(HttpStatusCode.NotFound, error)
      else
        return new FailView(
          HttpStatusCode.InternalServerError,
          new InternalServerError('ServerError')
        )
    }
  }
}
