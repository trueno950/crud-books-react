export interface PagingInterface {
  init: number
  limit: number
  num_page: number
  total_items: number
  total_pages: Array<string>
}

export interface ParametersFilters {
  page?: number;
  limit?: number;
  filter?: string;
}

export interface PropsInterface {
  children: JSX.Element
}

export interface ToastInterface {
  show: boolean
  type: 'success' | 'failed'
  description: string
}