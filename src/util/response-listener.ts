import { browser, WebRequest } from "webextension-polyfill-ts";

export function createResponseListener(
  dataHandler: (
    details: WebRequest.OnBeforeRequestDetailsType,
    body: string
  ) => unknown
) {
  return function listener(details: WebRequest.OnBeforeRequestDetailsType) {
    const filter = browser.webRequest.filterResponseData(details.requestId);
    const decoder = new TextDecoder("utf-8");
    let encoder = new TextEncoder();

    filter.ondata = (event) => {
      const str = decoder.decode(event.data, { stream: true });

      try {
        dataHandler(details, str);
      } catch (err) {
        console.error("Error during API response interception");
        console.error(err);
      }

      filter.write(encoder.encode(str));
      filter.disconnect();
    };

    return {};
  };
}
