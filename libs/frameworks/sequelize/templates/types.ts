import { blank, lines } from '@libs/core'

export const typesTemplate = (): string => lines([jsonType()])

const jsonType = (): string =>
  lines([
    `export interface JsonMap {[member: string]: string | number | boolean | null | JsonArray | JsonMap }`,
    blank(),
    `export interface JsonArray extends Array<string | number | boolean | null | JsonArray | JsonMap> {}`,
    blank(),
    `export type Json = JsonMap | JsonArray | string | number | boolean | null`,
    blank(),
  ])
