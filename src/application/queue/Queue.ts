export default interface Queue {
  consume(): Promise<any>
}
