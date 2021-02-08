export function indent(depth: number, value: string): string {
  return value
    .split('\n')
    .map((x, i) => (i !== 0 && x ? ' '.repeat(depth) + x : x))
    .join('\n')
}

export function blank(): string {
  return ''
}

type LinesOptions = {
  separator?: string
  depth?: number
}

const defaultLinesOptions: LinesOptions = {
  separator: '',
  depth: 0,
}
export function lines(
  xs: Array<string | null>,
  { separator = '', depth = 0 }: LinesOptions = defaultLinesOptions,
): string {
  return indent(depth, xs.filter((x): x is string => x !== null).join(`${separator}\n`))
}