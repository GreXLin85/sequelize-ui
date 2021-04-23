import { DirectoryItem, itemName } from '@src/core/files'
import {
  clearDirectory,
  deleteFileOrDirectory,
  tmpDirPath,
  writeFiles,
} from '@src/test-utils/files'
import { exec as exec_ } from 'child_process'
import { promisify } from 'util'
import { Project } from './project'

const exec = promisify(exec_)

export const NpmProject: Project = class {
  static build = buildNpmProject
  static destroy = deleteNpmProject
}

export async function buildNpmProject(
  directory: DirectoryItem,
  preinstall?: string,
): Promise<void> {
  const cwd = process.cwd()

  const dirname = tmpDirPath(itemName(directory))
  await clearDirectory(dirname, ['node_modules', 'dist', 'db'])
  await writeFiles(directory, tmpDirPath())
  process.chdir(dirname)

  await install(preinstall)
  await build()
  await start()

  process.chdir(cwd)
}

export function deleteNpmProject(name: string): Promise<void> {
  return deleteFileOrDirectory(tmpDirPath(name))
}

const install = async (preinstall?: string): Promise<void> => {
  if (preinstall) {
    await exec(preinstall)
  }
  return exec('npm install').then()
}
const build = (): Promise<void> => exec('npm run build -- --incremental').then()
const start = (): Promise<void> => exec('npm start').then()