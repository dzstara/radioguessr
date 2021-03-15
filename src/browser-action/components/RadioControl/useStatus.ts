import { useCallback, useEffect, useState } from "react";
import { browser } from "webextension-polyfill-ts";

import { StatusData } from "types";

export default function useStatus() {
  const [state, setState] = useState<StatusData>({
    loading: true,
    radio: null,
    position: null,
    playing: false,
  });

  const togglePlay = useCallback(() => {
    if (state.loading || state.position === null) return;

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
