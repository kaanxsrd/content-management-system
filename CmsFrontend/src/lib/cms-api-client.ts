export async function cmsApi<T>(path: string, options?: RequestInit): Promise<T> {
  const baseUrl = process.env.CMS_BACKEND_URL ?? 'http://localhost:5000'
  const apiKey = process.env.CMS_API_KEY ?? ''

  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
      ...(options?.headers ?? {})
    }
  })

  if (!res.ok) {
    throw new Error(`CMS API ${res.status}: ${path}`)
  }

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T
  }

  return res.json() as Promise<T>
}
