export async function fakeJsonP(uri: string) {
  const src = uri + "&callback=CB";
  const response = await fetch(src);
  const text = await response.text();
  return JSON.parse(text.slice(14, text.length - 2));
}
