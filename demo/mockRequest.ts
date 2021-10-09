type Option<Data extends any = any> = {
  data: Data
  delay: number
}

export const mockRequest =
  <T>({ data, delay }: Option<T>) =>
  (): Promise<T> =>
    new Promise(resolve => {
      setTimeout(() => resolve(data), delay)
    })
