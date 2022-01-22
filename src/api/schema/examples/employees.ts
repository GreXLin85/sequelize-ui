/**
 * Sample employee database
 * Copyright (C) 2007,2008, MySQL AB
 *
 * Original data created by Fusheng Wang and Carlo Zaniolo
 * http://timecenter.cs.aau.dk/software.htm
 *
 * Relational schema by Giuseppe Maxia
 * Data conversion from XML to relational by Patrick Crews
 * https://github.com/datacharmer/test_db/blob/master/employees.sql
 *
 * Sequelize UI TypeScript schema by Tom Schuster
 *
 * This work is licensed under the
 * Creative Commons Attribution-Share Alike 3.0 Unported License.
 * To view a copy of this license, visit
 * http://creativecommons.org/licenses/by-sa/3.0/ or send a letter to
 * Creative Commons, 171 Second Street, Suite 300,
 * San Francisco, California, 94105, USA.
 *
 */
import {
  belongsToType,
  dateDataType,
  enumDataType,
  hasManyType,
  integerDataType,
  manyToManyModelType,
  Model,
  Schema,
  stringDataType,
} from '@src/core/schema'
import { fromParts } from '@src/utils/dateTime'
import shortid from 'shortid'
import { EMPLOYEES_ID } from './ids'

const time = fromParts(2020, 10, 1)

enum Id {
  Employees = '1',
  Departments = '2',
  DepartmentEmployees = '3',
  DepartmentManagers = '4',
  Titles = '5',
  Salaries = '6',
}

const employee: Model = {
  id: Id.Employees,
  name: 'employees',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: shortid(),
      name: 'emp_no',
      type: integerDataType({ autoincrement: true }),
      primaryKey: true,
      required: true,
      unique: false,
    },
    {
      id: shortid(),
      name: 'birth_date',
      type: dateDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: shortid(),
      name: 'first_name',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: shortid(),
      name: 'last_name',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: shortid(),
      name: 'gender',
      type: enumDataType({ values: ['M', 'F', 'O'] }),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: shortid(),
      name: 'hire_date',
      type: dateDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
  ],
  associations: [
    {
      id: shortid(),
      alias: null,
      foreignKey: 'emp_no',
      type: hasManyType(),
      sourceModelId: Id.Employees,
      targetModelId: Id.Salaries,
    },
    {
      id: shortid(),
      alias: null,
      foreignKey: 'emp_no',
      type: hasManyType(),
      sourceModelId: Id.Employees,
      targetModelId: Id.Titles,
    },
    {
      id: shortid(),
      alias: 'employingDepartment',
      foreignKey: 'emp_no',
      sourceModelId: Id.Employees,
      targetModelId: Id.Departments,
      type: manyToManyModelType(Id.DepartmentEmployees, 'dept_no'),
    },
    {
      id: shortid(),
      alias: 'managedDepartment',
      foreignKey: 'emp_no',
      sourceModelId: Id.Employees,
      targetModelId: Id.Departments,
      type: manyToManyModelType(Id.DepartmentManagers, 'dept_no'),
    },
  ],
}

const department: Model = {
  id: Id.Departments,
  name: 'departments',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: shortid(),
      name: 'dept_no',
      type: stringDataType(),
      primaryKey: true,
      required: true,
      unique: false,
    },
    {
      id: shortid(),
      name: 'dept_name',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
  ],
  associations: [
    {
      id: shortid(),
      alias: 'employee',
      foreignKey: null,
      sourceModelId: Id.Departments,
      targetModelId: Id.Employees,
      type: manyToManyModelType(Id.DepartmentEmployees),
    },
    {
      id: shortid(),
      alias: 'manager',
      foreignKey: null,
      sourceModelId: Id.Departments,
      targetModelId: Id.Employees,
      type: manyToManyModelType(Id.DepartmentManagers),
    },
    {
      id: shortid(),
      alias: null,
      foreignKey: 'dept_no',
      type: hasManyType(),
      sourceModelId: Id.Departments,
      targetModelId: Id.DepartmentEmployees,
    },
    {
      id: shortid(),
      alias: null,
      foreignKey: 'dept_no',
      type: hasManyType(),
      sourceModelId: Id.Departments,
      targetModelId: Id.DepartmentManagers,
    },
  ],
}

const departmentEmployee: Model = {
  id: Id.DepartmentEmployees,
  name: 'dept_emp',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: shortid(),
      name: 'emp_no',
      type: integerDataType(),
      primaryKey: true,
      required: true,
      unique: false,
    },
    {
      id: shortid(),
      name: 'dept_no',
      type: stringDataType(),
      primaryKey: true,
      required: true,
      unique: false,
    },
    {
      id: shortid(),
      name: 'from_date',
      type: dateDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: shortid(),
      name: 'to_date',
      type: dateDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
  ],
  associations: [
    {
      id: shortid(),
      alias: null,
      foreignKey: 'emp_no',
      type: belongsToType(),
      sourceModelId: Id.DepartmentEmployees,
      targetModelId: Id.Employees,
    },
    {
      id: shortid(),
      alias: null,
      foreignKey: 'dept_no',
      type: belongsToType(),
      sourceModelId: Id.DepartmentEmployees,
      targetModelId: Id.Departments,
    },
  ],
}

const departmentManager: Model = {
  id: Id.DepartmentManagers,
  name: 'dept_manager',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: shortid(),
      name: 'emp_no',
      type: integerDataType(),
      primaryKey: true,
      required: true,
      unique: false,
    },
    {
      id: shortid(),
      name: 'dept_no',
      type: stringDataType(),
      primaryKey: true,
      required: true,
      unique: false,
    },
    {
      id: shortid(),
      name: 'from_date',
      type: dateDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: shortid(),
      name: 'to_date',
      type: dateDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
  ],
  associations: [
    {
      id: shortid(),
      alias: null,
      foreignKey: 'emp_no',
      type: belongsToType(),
      sourceModelId: Id.DepartmentManagers,
      targetModelId: Id.Employees,
    },
    {
      id: shortid(),
      alias: null,
      foreignKey: 'dept_no',
      type: belongsToType(),
      sourceModelId: Id.DepartmentManagers,
      targetModelId: Id.Departments,
    },
  ],
}

const title: Model = {
  id: Id.Titles,
  name: 'titles',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: shortid(),
      name: 'emp_no',
      type: integerDataType({ autoincrement: true }),
      primaryKey: true,
      required: true,
      unique: false,
    },
    {
      id: shortid(),
      name: 'title',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: shortid(),
      name: 'from_date',
      type: dateDataType(),
      primaryKey: true,
      required: true,
      unique: false,
    },
    {
      id: shortid(),
      name: 'to_date',
      type: dateDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
  ],
  associations: [
    {
      id: shortid(),
      alias: null,
      foreignKey: 'emp_no',
      type: belongsToType(),
      sourceModelId: Id.Titles,
      targetModelId: Id.Employees,
    },
  ],
}

const salary: Model = {
  id: Id.Salaries,
  name: 'salaries',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: shortid(),
      name: 'emp_no',
      type: integerDataType({ autoincrement: true }),
      primaryKey: true,
      required: true,
      unique: false,
    },
    {
      id: shortid(),
      name: 'salary',
      type: integerDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: shortid(),
      name: 'from_date',
      type: dateDataType(),
      primaryKey: true,
      required: true,
      unique: false,
    },
    {
      id: shortid(),
      name: 'to_date',
      type: dateDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
  ],
  associations: [
    {
      id: shortid(),
      alias: null,
      foreignKey: 'emp_no',
      type: belongsToType(),
      sourceModelId: Id.Salaries,
      targetModelId: Id.Employees,
    },
  ],
}

// https://github.com/datacharmer/test_db
const employeeSchema: Schema = {
  id: EMPLOYEES_ID,
  name: 'employee dataset',
  createdAt: time,
  updatedAt: time,
  forkedFrom: null,
  models: [employee, department, departmentEmployee, departmentManager, title, salary],
}

export default employeeSchema
