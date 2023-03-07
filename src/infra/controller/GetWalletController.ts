import { InternalServerError } from '@/application/errors/errors'
import FailView from '../presenters/FailView'
import SuccessView from '../presenters/SuccessView'
import GetWallet from '@/application/usecase/get-wallet/GetWallet'
import { Output } from '@/application/usecase/get-wallet/Output'
import { HttpStatusCode } from '../http/HttpStatusCode'

export default class GetWalletController {
  constructor(readonly getWallet: GetWallet) {}

  async execute(ownerCode: string): Promise<SuccessView<Output> | FailView> {
    try {
      const output = await this.getWallet.execute(ownerCode)
      return new SuccessView(HttpStatusCode.OK, output)
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
