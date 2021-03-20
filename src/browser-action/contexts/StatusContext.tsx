import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { browser } from "webextension-polyfill-ts";

import { StatusData } from "../../types";

interface IStatusContext {
  state: StatusData;
  togglePlay: () => unknown;
  setVolume: (volume: number) => unknown;
}

const StatusContext = createContext<IStatusContext>({
  state: {
    loading: true,
    radio: null,
    country: null,
    playing: false,
    intent: false,
    volume: 1,
  },
  togglePlay: () => {},
  setVolume: () => {},
});

export function StatusContextProvider(props: PropsWithChildren<{}>) {
  const value = useStatusData();

  return <StatusContext.Provider value={value} children={props.children} />;
}

export function useStatus() {
  return useContext(StatusContext);
}

function useStatusData() {
  const [state, setState] = useState<StatusData>({
    loading: true,
    radio: null,
    country: null,
    playing: false,
    intent: false,
    volume: 0.2,
  });

  const togglePlay = useCallback(() => {
    browser.runtime.sendMessage({
      action: "TOGGLE_PLAY",
    });
  }, [state.loading]);

  const setVolume = useCallback((volume: number) => {
    browser.runtime.sendMessage({
      action: "SET_VOLUME",
      data: volume,
    });
  }, []);

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

  return { state, togglePlay, setVolume };
}
