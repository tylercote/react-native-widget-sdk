import { readFileSync, writeFileSync } from "fs"
import { basename, join } from "path"
import YAML from "yaml"

YAML.defaultOptions.merge = true

export type NamespaceDefinition = {
  [index: string]: ActionDefinition
}

export type ActionDefinition = {
  [index: string]: MessageDefinition
}

export type MessageDefinition = {
  [index: string]: "string" | "number"
}

const defsFilename = "definitions.yml"
const fileHeaderTemplate = `
/**
 * This file is auto-generated by {filename}, DO NOT EDIT.
 *
 * If you need to make changes to the code in this file, you can do so by
 * modifying {defsFilename}.
 */
`

export const withEachMessageDefinition = <R>(cb: (ns: string, action: string, defn: MessageDefinition) => R): R[] => {
  const namespaces = loadNamespaces()
  const results: R[] = []

  for (const namespace in namespaces) {
    const actions = namespaces[namespace]
    for (const action in actions) {
      results.push(cb(namespace, action, actions[action]))
    }
  }

  return results
}

export const loadNamespaces = (): NamespaceDefinition => {
  const defsFile = join(__dirname, defsFilename)
  console.log(`Loading post messages from ${defsFile}`)

  const defsData = readFileSync(defsFile)
  const data =  YAML.parse(defsData.toString()) as { namespaces: NamespaceDefinition }
  return data.namespaces
}

export const fileHeader = (filename: string) =>
  merge(fileHeaderTemplate, {
    defsFilename,
    filename: basename(filename),
  })

export const write = (sourceScipt: string, dest: string, contents: string) => {
  contents = fileHeader(sourceScipt) + "\n" + contents
  if (contents[contents.length - 1] !== "\n") {
    contents = contents + "\n"
  }
  console.log(`Writing ${contents.length} bytes to ${dest}`)
  writeFileSync(dest, contents)
}

export const merge = (template: string, fields: Record<string, string>) =>
  Object.keys(fields).reduce((str, field) =>
    str.replace(new RegExp(`{${field}}`, "g"), fields[field]), template).trim()

export const genMessageKey = (namespace: string, action: string) =>
  camelCase(isParentDefn(action) ? namespace : `${namespace}_${action}`)

export const genMessageType =(namespace: string, action: string) =>
  isParentDefn(action) ? `mx/${namespace}` : `mx/${namespace}/${action}`

export const isParentDefn = (action: string) =>
  action === "_"

export const camelCase = (str: string) =>
  str
    .replace(/(^[a-z])/i, (match) => match.toUpperCase())
    .replace(/([-_][a-z])/ig, (match) => match.toUpperCase())
    .replace("-", "")
    .replace("_", "")
