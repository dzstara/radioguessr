import { useCallback, useEffect, useState } from "react";
import { browser } from "webextension-polyfill-ts";

import { StatusData } from "types";

export default function useStatus() {
  const [state, setState] = useState<StatusData>({
    loading: true,
    radio: null,
    country: null,
    playing: false,
    intent: false,
  });

  const togglePlay = useCallback(() => {
    browser.runtime.sendMessage({
      action: "TOGGLE_PLAY",
    });
  }, [state.loading]);

  useEffect(() => {
    const handler = (request: any) => {
      if (request.action === "STATE_UPDATE") setState(request.data);
    };

    browser.runtime.onMessage.addListener(handler);

    return () => {
      browser.runtime.onMessage.removeListener(handler);
    };
  }, []);

  useEffect(() => {
    browser.runtime
      .sendMessage({
        action: "GET_STATE",
      })
      .then(setState);
  }, []);

  return { state, togglePlay };
}
