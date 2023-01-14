export type Output = {
  name: string
  description: string
  customInfos: customInfo[] | []
}

type customInfo = {
  title: string
  info: string
  description?: string
}
