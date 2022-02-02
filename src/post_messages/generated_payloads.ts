/**
 * This file is auto-generated by generate_payloads.ts, DO NOT EDIT.
 *
 * If you need to make changes to the code in this file, you can do so by
 * modifying definitions.yml.
 */
import { Type } from "./generated_types"

export type LoadPayload = {
  type: Type.Load

}

export type ConnectLoadedPayload = {
  type: Type.ConnectLoaded
  user_guid: string
  session_guid: string
}

export type ConnectSelectedInstitutionPayload = {
  type: Type.ConnectSelectedInstitution
  user_guid: string
  session_guid: string
  code: string
  guid: string
  name: string
  url: string
}

export type ConnectStepChangePayload = {
  type: Type.ConnectStepChange
  user_guid: string
  session_guid: string
  previous: string
  current: string
}

export type GenericPayload
  = LoadPayload

export type WidgetPayload
  = ConnectLoadedPayload
  | ConnectSelectedInstitutionPayload
  | ConnectStepChangePayload

export type Payload
  = GenericPayload
  | WidgetPayload

export function buildPayload(type: Type, metadata: Record<string, string>): Payload {
  switch (type) {
    case Type.Load:
      return {
        type,

      }

    case Type.ConnectLoaded:
      return {
        type,
        user_guid: metadata.user_guid,
        session_guid: metadata.session_guid,
      }

    case Type.ConnectSelectedInstitution:
      return {
        type,
        user_guid: metadata.user_guid,
        session_guid: metadata.session_guid,
        code: metadata.code,
        guid: metadata.guid,
        name: metadata.name,
        url: metadata.url,
      }

    case Type.ConnectStepChange:
      return {
        type,
        user_guid: metadata.user_guid,
        session_guid: metadata.session_guid,
        previous: metadata.previous,
        current: metadata.current,
      }

    default:
      throw new Error(`unknown post message type: ${type}`)
  }
}
