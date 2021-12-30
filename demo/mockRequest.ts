type Option = {
  data: any
  delay: number
}

export const mockRequest =
  <T>({ data, delay }: Option) =>
  (): Promise<T> =>
    new Promise(resolve => {
      setTimeout(() => resolve(data), delay)
    })
