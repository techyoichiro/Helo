import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type FetchArgs = Parameters<typeof fetch>

export type FetcherError = { error: string }
export type FetcherResponse<T> = T | FetcherError

export async function fetcher<T>(url: FetchArgs[0], args: FetchArgs[1]): Promise<FetcherResponse<T>> {
  const response = await fetch(url, args)
  const data = await response.json()

  if (!response.ok) {
    return { error: data.error || 'An error occurred' }
  }

  return data as T
}
