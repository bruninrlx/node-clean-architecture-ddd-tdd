export default class SuccessView<T> {
  constructor(readonly status: number, readonly response: T) {}
}
