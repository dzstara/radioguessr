export interface Position {
  lat: number;
  lng: number;
}

export interface StatusData {
  loading: boolean;
  radio: string | null;
  position: Position | null;
  playing: boolean;
}
