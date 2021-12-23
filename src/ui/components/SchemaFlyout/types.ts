import { Association, Field, Model, Schema } from '@src/core/schema'
import { ModelErrors, SchemaErrors } from '@src/core/validation/schema'

export const enum SchemaFlyoutStateType {
  CODE = 'code',
  VIEW_SCHEMA = 'view-schema',
  EDIT_SCHEMA = 'edit-schema',
  VIEW_MODEL = 'view-model',
  EDIT_MODEL = 'edit-model',
}

export type SchemaFlyoutState =
  | { type: SchemaFlyoutStateType.CODE }
  | { type: SchemaFlyoutStateType.VIEW_SCHEMA; schema: Schema }
  | {
      type: SchemaFlyoutStateType.EDIT_SCHEMA
      schema: Schema
      errors: SchemaErrors
      newModel?: boolean
    }
  | { type: SchemaFlyoutStateType.VIEW_MODEL; model: Model }
  | {
      type: SchemaFlyoutStateType.EDIT_MODEL
      model: Model
      errors: ModelErrors
      initialState?: InitialEditModelState
    }

export const enum InitialEditModelStateType {
  NEW_FIELD = 'new-field',
  NEW_ASSOCIATION = 'new-association',
  EDIT_FIELD = 'edit-field',
  EDIT_ASSOCIATION = 'edit-association',
}

export type InitialEditModelState =
  | { type: InitialEditModelStateType.NEW_FIELD }
  | { type: InitialEditModelStateType.NEW_ASSOCIATION }
  | { type: InitialEditModelStateType.EDIT_FIELD; field: Field }
  | { type: InitialEditModelStateType.EDIT_ASSOCIATION; association: Association }
