export type ApiResponse<T> = {
  data?: T
  error?: unknown
}

async function apiCall<T>(
  method: string,
  endpoint: string,
  query?: Record<string, string>,
  body?: any
): Promise<ApiResponse<T>> {
  const queryString = query ? '?' + new URLSearchParams(query).toString() : ''
  const response = await fetch(`/api${endpoint}${queryString}`, {
    credentials: 'include',
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : null,
  })

  if (response.ok) {
    const data = await response.json()
    return { data }
  } else {
    const error = await response.text()
    return { error }
  }
}

export function apiGet<T>(endpoint: string, query?: Record<string, string>): Promise<ApiResponse<T>> {
  return apiCall<T>('GET', endpoint, query)
}

export function apiPost<T>(endpoint: string, body: any, query?: Record<string, string>): Promise<ApiResponse<T>> {
  return apiCall<T>('POST', endpoint, query, body)
}

export function apiPut<T>(endpoint: string, body: any, query?: Record<string, string>): Promise<ApiResponse<T>> {
  return apiCall<T>('PUT', endpoint, query, body)
}

export function apiDelete<T>(endpoint: string, query?: Record<string, string>): Promise<ApiResponse<T>> {
  return apiCall<T>('DELETE', endpoint, query)
}
