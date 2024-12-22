export interface Store {
    id: string;
    name: string;
    address: string;
    distance: number;
    location: {
      lat: number;
      lng: number;
    };
    openingHours?: string[];
    isOpen?: boolean;
    rating?: number;
}