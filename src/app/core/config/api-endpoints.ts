export const API_ENDPOINTS = {
  PRODUCTS: {
    LIST: '/Item/ProductList',
    GET: (id: number) => `/Item/GetProduct/${id}`,
    ADD: '/Item/AddProduct',
    SET_REDIRECT_URL: '/Item/SetProductRedirectUrl'
  }
} as const; 