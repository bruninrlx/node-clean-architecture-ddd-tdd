import express from 'express'
import HttpServer from './HttpServer'

export default class ExpressAdapter implements HttpServer {
  app: any

  constructor() {
    this.app = express()
    this.app.use(express.json())
  }

  on(method: string, url: string, callback: Function): void {
    this.app[method](url, async function (req: any, res: any) {
      const output = await callback(req.query, req.body)
      res.status(output.status).json(output)
    })
  }

  listen(port: number | string): any {
    return this.app.listen(port)
  }
}
