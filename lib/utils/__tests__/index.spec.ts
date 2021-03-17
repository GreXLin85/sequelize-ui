import { expect } from 'chai'
import forEach from 'mocha-each'
import { qsValueToIntEnum, qsValueToStringEnum, toEnum } from '..'

enum IntEnum {
  Foo,
  Bar,
  Baz,
}

enum StringEnum {
  Foo = 'FOO',
  Bar = 'BAR',
  Baz = 'BAZ',
}

describe('utils', () => {
  describe('enum', () => {
    describe('toEnum', () => {
      const intCases = [
        [0, IntEnum, IntEnum.Foo],
        [1, IntEnum, IntEnum.Bar],
        [2, IntEnum, IntEnum.Baz],
        [3, IntEnum, undefined],
        ['', IntEnum, undefined],
        ['0', IntEnum, undefined],
        ['1', IntEnum, undefined],
        ['2', IntEnum, undefined],
        ['3', IntEnum, undefined],
      ]
      forEach(intCases).describe(`(IntEnum, %s)`, (key, object, expected) => {
        it(`=== ${expected}`, () => {
          expect(toEnum(object, key)).to.equal(expected)
        })
      })

      const stringCases = [
        ['FOO', StringEnum, StringEnum.Foo],
        ['BAR', StringEnum, StringEnum.Bar],
        ['BAZ', StringEnum, StringEnum.Baz],
        ['', StringEnum, undefined],
        ['0', IntEnum, undefined],
        ['1', IntEnum, undefined],
        ['2', IntEnum, undefined],
        ['3', IntEnum, undefined],
      ]
      forEach(stringCases).describe(`(StringEnum, %s)`, (key, object, expected) => {
        it(`=== ${expected}`, () => {
          expect(toEnum(object, key)).to.equal(expected)
        })
      })
    })
  })

  describe('url', () => {
    describe('qsValueToStringEnum', () => {
      const cases = [
        ['FOO', StringEnum, StringEnum.Foo],
        ['BAR', StringEnum, StringEnum.Bar],
        ['BAZ', StringEnum, StringEnum.Baz],
        ['', StringEnum, undefined],
        [undefined, StringEnum, undefined],
        [['0'], StringEnum, undefined],
      ]
      forEach(cases).describe(`(IntEnum, %s)`, (key, object, expected) => {
        it(`=== ${expected}`, () => {
          expect(qsValueToStringEnum(object, key)).to.equal(expected)
        })
      })

      describe('qsValueToIntEnum', () => {
        const intCases = [
          ['0', IntEnum, IntEnum.Foo],
          ['1', IntEnum, IntEnum.Bar],
          ['2', IntEnum, IntEnum.Baz],
          ['3', IntEnum, undefined],
          ['', IntEnum, undefined],
          [undefined, IntEnum, undefined],
          [['0'], IntEnum, undefined],
        ]
        forEach(intCases).describe(`(IntEnum, %s)`, (key, object, expected) => {
          it(`=== ${expected}`, () => {
            expect(qsValueToIntEnum(object, key)).to.equal(expected)
          })
        })
      })
    })
  })
})
