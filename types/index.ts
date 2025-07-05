export type Listing = {
  id?: string;
  public_id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  location: string;
  email_address: string;
  created_at: string;
  image_urls: string[];
  user_id?: string
};

export interface MessageSellerProps {
  listing: Listing;
  currentUserId: string | null;
  currentEmail: string | null;
  hasSentMessage: boolean;
  setHasSentMessage: (v: boolean) => void;
}


export type Message = {
  id: string;
  listing_id: number;
  buyer_email: string;
  seller_email: string;
  message: string;
  created_at: string;
};
