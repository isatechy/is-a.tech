export interface NavItem {
  title: string
  href: string
  disabled?: boolean
}

export interface DNSList {
  result?: ResultEntity[] | null
  success: boolean
  errors?: null[] | null
  messages?: null[] | null
  result_info: ResultInfo
}
export interface ResultEntity {
  id: string
  zone_id: string
  zone_name: string
  name: string
  type: string
  content: string
  proxiable: boolean
  proxied: boolean
  ttl: number
  locked: boolean
  meta: Meta
  comment?: string | null
  tags?: null[] | null
  created_on: string
  modified_on: string
  priority?: number | null
  data?: Data | null
}
export interface Meta {
  auto_added: boolean
  managed_by_apps: boolean
  managed_by_argo_tunnel: boolean
}
export interface Data {
  name: string
  port: number
  priority: number
  proto: string
  service: string
  target: string
  weight: number
}
export interface ResultInfo {
  page: number
  per_page: number
  count: number
  total_count: number
  total_pages: number
}

interface CloudflareError {
  code: number
  message: string
}

export interface DNSCreate {
  success: boolean
  errors?: CloudflareError[]
  result: {
    id: string
    zone_id: string
  }
}

export interface Result {
  id: string
  zone_id: string
  zone_name: string
  name: string
  type: string
  content: string
  proxiable: boolean
  proxied: boolean
  ttl: number
  locked: boolean
  meta: Meta
  comment: string
  tags?: null[] | null
  created_on: string
  modified_on: string
}

export interface Meta {
  auto_added: boolean
  managed_by_apps: boolean
  managed_by_argo_tunnel: boolean
}
