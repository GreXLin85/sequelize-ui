import {
  Association,
  associationTypeIsSingular,
  AssociationTypeType,
  displayAssociationTypeType,
  displayThroughType,
  ManyToManyAssociation,
  Model,
  Schema,
  ThroughType,
} from '@src/core/schema'
import { AssociationErrors } from '@src/core/validation/schema'
import Radio from '@src/ui/components/form/Radio'
import Select from '@src/ui/components/form/Select'
import TextInput from '@src/ui/components/form/TextInput'
import { button } from '@src/ui/styles/utils'
import { plural, singular, snakeCase } from '@src/utils/string'
import React, { useCallback, useMemo } from 'react'

type AssociationFieldsetProps = {
  association: Association
  schema: Schema
  model: Model
  errors?: AssociationErrors
  onChange: (id: Association['id'], changes: Partial<Association>) => void
  onDelete: (id: Association['id']) => void
}

function AssociationFieldset({
  association,
  schema,
  model,
  errors,
  onChange,
  onDelete,
}: AssociationFieldsetProps): React.ReactElement {
  const modelOptions = React.useMemo(
    () => schema.models.map<[string, Model]>((m) => [m.id, m]),
    [schema.models],
  )

  const targetModel: Model = useMemo(
    () => schema.models.find((m) => m.id === association.targetModelId) as Model,
    [schema.models, association.targetModelId],
  )

  const throughModel: Model | undefined = useMemo(
    () =>
      schema.models.find(
        (m) =>
          association.type.type === AssociationTypeType.ManyToMany &&
          association.type.through.type === ThroughType.ThroughModel &&
          m.id === association.type.through.modelId,
      ),
    [schema.models, association.type],
  )

  const handleChange = useCallback(
    (changes: Partial<Association>): void => {
      onChange(association.id, changes)
    },
    [association.id, onChange],
  )

  const handleChangeManyToMany = useCallback(
    (changes: Partial<ManyToManyAssociation>) => {
      if (association.type.type !== AssociationTypeType.ManyToMany) return
      handleChange({ type: { ...association.type, ...changes } })
    },
    [association.type, handleChange],
  )

  const handleChangeType = useCallback(
    (typeType: AssociationTypeType) => {
      if (typeType === AssociationTypeType.ManyToMany) {
        handleChange({
          type: {
            type: typeType,
            through: {
              type: ThroughType.ThroughTable,
              table: snakeCase(`${model.name} ${targetModel.name}`),
            },
          },
        })
        return
      }

      handleChange({ type: { type: typeType } })
    },
    [model.name, targetModel.name, handleChange],
  )

  const handleChangeTarget = useCallback(
    (model: Model) => handleChange({ targetModelId: model.id }),
    [handleChange],
  )

  const handleChangeAlias = useCallback(
    (alias?: string) => handleChange({ alias: alias || undefined }),
    [handleChange],
  )

  const handleChangeForeignKey = useCallback(
    (foreignKey?: string) => handleChange({ foreignKey: foreignKey || undefined }),
    [handleChange],
  )

  const handleChangeThroughType = useCallback(
    (type: ThroughType) => {
      const associationType = association.type
      if (associationType.type !== AssociationTypeType.ManyToMany) {
        return
      }

      const table = snakeCase(`${model.name} ${targetModel.name}`)

      if (type === ThroughType.ThroughTable) {
        handleChangeManyToMany({ through: { type, table } })
        return
      }

      const throughModel =
        schema.models.find((m) => snakeCase(m.name) === table) || schema.models[0]

      if (throughModel) {
        handleChangeManyToMany({ through: { type, modelId: throughModel.id } })
      }
    },
    [association.type, model.name, targetModel, schema.models, handleChangeManyToMany],
  )

  const handleChangeThroughModel = useCallback(
    (model: Model) => {
      handleChangeManyToMany({
        through: { type: ThroughType.ThroughModel, modelId: model.id },
      })
    },
    [handleChangeManyToMany],
  )

  const handleChangeThroughTable = useCallback(
    (table?: string) =>
      handleChangeManyToMany({
        through: { type: ThroughType.ThroughTable, table: table || '' },
      }),
    [handleChangeManyToMany],
  )

  const handleChangeTargetForeignKey = useCallback(
    (targetFk?: string) => handleChangeManyToMany({ targetFk: targetFk || undefined }),
    [handleChangeManyToMany],
  )

  const handleDelete = useCallback(() => onDelete(association.id), [onDelete, association.id])

  return (
    <fieldset className={button}>
      <Select
        id={`association-type-${association.id}`}
        label="Type"
        options={AssociationTypeType}
        display={displayAssociationTypeType}
        value={association.type.type}
        onChange={handleChangeType}
      />
      <Select
        id={`association-target-model-${association.id}`}
        label="Target model"
        options={modelOptions}
        display={modelName}
        value={targetModel}
        onChange={handleChangeTarget}
      />
      <TextInput
        id={`association-alias-${association.id}`}
        label="as"
        value={association.alias || ''}
        placeholder={aliasPlaceholder(association, targetModel)}
        error={errors?.alias}
        onChange={handleChangeAlias}
      />
      <TextInput
        id={`association-fk-${association.id}`}
        label="Foreign key"
        value={association.foreignKey || ''}
        error={errors?.foreignKey}
        onChange={handleChangeForeignKey}
      />
      {association.type.type === AssociationTypeType.ManyToMany && schema.models.length > 0 && (
        <>
          <Radio
            options={ThroughType}
            value={association.type.through.type}
            display={displayThroughType}
            onChange={handleChangeThroughType}
          />
          {association.type.through.type === ThroughType.ThroughModel && (
            <Select
              id={`association-through-model-${association.id}`}
              label="Through model"
              options={modelOptions}
              display={modelName}
              value={throughModel}
              onChange={handleChangeThroughModel}
            />
          )}
          {association.type.through.type === ThroughType.ThroughTable && (
            <>
              <TextInput
                id={`association-through-table-${association.id}`}
                label="Through table"
                value={association.type.through.table}
                error={errors?.throughTable}
                onChange={handleChangeThroughTable}
              />
            </>
          )}
          <TextInput
            id={`association-target-fk-${association.id}`}
            label="Target foreign key"
            value={association.type.targetFk || ''}
            error={errors?.targetForeignKey}
            onChange={handleChangeTargetForeignKey}
          />
        </>
      )}
      <button type="button" onClick={handleDelete}>
        Delete
      </button>
    </fieldset>
  )
}

function modelName(model: Model): string {
  return model.name
}

function aliasPlaceholder(association: Association, model: Model): string | undefined {
  return association.alias
    ? undefined
    : associationTypeIsSingular(association.type)
    ? singular(model.name)
    : plural(model.name)
}

export default React.memo(AssociationFieldset)
