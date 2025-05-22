export interface Product {
  id: number;
  description: string;
  contactId: number;
  userName: string;
  amount: number;
  currencyCode: string;
  symbol: string;
  reference: string;
  routingCode: string;
  token: string;
  paymentUrl: string;
  redirectUrl: string;
  isInactive: boolean;
  imageUrl?: string;
}

