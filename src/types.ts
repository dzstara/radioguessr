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

export interface RadioStation {
  url: string;
  country: string;
}

export interface GeoJSON<T> {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    geometry: any;
    properties: T;
  }>;
}
