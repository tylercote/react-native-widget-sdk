import base64 from "react-native-base64"

import { Environment, Host } from "./environment"
import { Type } from "../widget/widgets"
import { Options } from "../widget/options"

type ExtraOptions<Mode> = Partial<Omit<Options<Mode>, "widget_type">>

type SsoWidgetRequest = {
  url: string
  options: {
    method: string
    headers: Record<string, string>
    body: string
  }
}

type SsoWidgetResponse = {
  widget_url: {
    type: Type
    url: string
  }
}

type SsoRequestParams<Mode> = {
  apiKey: string
  clientId: string
  userGuid: string
  widgetType: Type
  environment: Environment
  options?: ExtraOptions<Mode>
}

export function makeConnectWidgetRequest<Mode>(params: Omit<SsoRequestParams<Mode>, "widgetType">): Promise<SsoWidgetResponse> {
  return makeRequest({ ...params, widgetType: Type.ConnectWidget })
}

export function makeRequest<Mode>(params: SsoRequestParams<Mode>): Promise<SsoWidgetResponse> {
  const req = genRequest(params)
  return fetch(req.url, req.options)
    .then((response) => response.json())
}

function genRequest<Mode>({ apiKey, clientId, userGuid, widgetType, environment, options = {} }: SsoRequestParams<Mode>): SsoWidgetRequest {
  const url = `${Host[environment]}/users/${userGuid}/widget_urls`
  const method = "POST"

  const authorization = base64.encode(`${clientId}:${apiKey}`)
  const headers = {
    Accept: "application/vnd.mx.api.v1+json",
    Authorization: `Basic ${authorization}`,
    "Content-Type": "application/json",
  }

  const body = JSON.stringify({
    widget_url: {
      widget_type: widgetType,
      is_mobile_webview: true,
      ui_message_version: 4,
      ...options,
    },
  })

  return {
    url,
    options: {
      method,
      headers,
      body,
    },
  }
}
