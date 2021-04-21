import { DataTypeType, Field, Model, SqlDialect } from '@lib/core'
import { pascalCase, plural as plural_, singular } from '@lib/utils'
import shortid from 'shortid'

// some association methods have singular and plural forms
// for example: "has many deer" would have addDeer for both adding one or multiple deer
// so we must append an 's' for nouns whose plural is the same as their singular
export const plural = (v: string): string => {
  if (plural_(v) === singular(v)) return `${v}s`
  return plural_(v)
}

export const modelName = ({ name }: Model): string => singular(pascalCase(name))

export const addIdField = (fields: Field[]): Field[] =>
  fields.some((f) => f.primaryKey) ? fields : [idField(), ...fields]

const idField = (): Field => ({
  id: shortid(),
  name: 'id',
  type: { type: DataTypeType.Integer },
  primaryKey: true,
})

export const hasJsonType = (model: Model): boolean =>
  model.fields.some((f) => f.type.type === DataTypeType.Json)

export const literalFunction = (fn: string): string => `Sequelize.literal('${fn}')`

export const sqlDialiectConfigValue = (dialect: SqlDialect): string => {
  switch (dialect) {
    case SqlDialect.MariaDb:
      return 'mariadb'
    case SqlDialect.MsSql:
      return 'mssql'
    case SqlDialect.MySql:
      return 'mysql'
    case SqlDialect.Postgres:
      return 'postgres'
    case SqlDialect.Sqlite:
      return 'sqlite'
  }
}
