/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IHttpAdapterProvider {
  body(): any
  params(): any
  query(): any
  headers(): Record<string, string | string[] | undefined>
  requestId(): string
}
