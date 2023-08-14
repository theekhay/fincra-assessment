export const errorHandler = (err: any, req: any, res: any, next: any) => {
  console.error('err', err)
  res
    .status(500)
    .send({
      success: false,
      message: 'An error occurred while processing this request',
      data: err.toString()
    })
}

export const error404 = (req: any, res: any, next: any) => {
  return res.status(404).json({
    status: false,
    message: 'invalid route'
  })
}

export const normalizePort = (val: string) => {
  const port = parseInt(val, 10)
  if (Number.isNaN(port)) throw new Error('Invalid port provided')
  if (port >= 0) return port
  throw new Error('Invalid port provided')
}