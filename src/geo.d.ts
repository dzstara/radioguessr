declare module "fast-reverse-geocoder" {
  function search(lng: number, lat: number): { code: string };
  export { search };
}
