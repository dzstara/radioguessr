declare module "@geo-maps/countries-maritime-250m";

declare module "which-polygon" {
  type fc = ([lat, lng]: [lat: number, lng: number]) => { A3: string };
  function wc(data: any): fc;

  export default wc;
}
