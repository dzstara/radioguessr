import { useCallback, useEffect, useState } from "react";

export default function useStatus() {
  const [state, setState] = useState({
    loading: true,
  });

  const togglePlay = useCallback(() => {
    if (state.loading || state.position === null) return;

    browser.runtime.sendMessage({
      action: "TOGGLE_PLAY",
    });
  }, [state.loading]);

  useEffect(() => {
    const handler = (request) => {
      if (request.action === "STATE_UPDATE") setState(request.data);
      return true;
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
