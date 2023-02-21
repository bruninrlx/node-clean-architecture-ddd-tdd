export type Output = {
  name: string
  description: string
  customInfos: CustomInfo[] | []
}[]

type CustomInfo = {
  title: string
  info: string
  description?: string
}
