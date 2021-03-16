export interface Position {
  lat: number;
  lng: number;
}

export interface StatusData {
  loading: boolean;
  radio: string | null;
  country: string | null;
  playing: boolean;
  intent: boolean;
}
