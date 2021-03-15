import * as React from "react";
import classnames from "classnames";

import { StatusData } from "types";
import useStatus from "./useStatus";

export default function RadioControl() {
  const { state, togglePlay } = useStatus();

  return (
    <div
      className={classnames("btn", {
        "btn-loading": state.loading,
        "btn-valid": !state.loading && state.position !== null,
        "btn-disabled": state.position === null,
      })}
      onClick={togglePlay}
    >
      {getButtonText(state)}
    </div>
  );
}

function getButtonText(state: StatusData) {
  if (state.loading) return "loading";
  if (state.position === null) return "no position found";

  if (state.playing) return "stop";
  return "start";
}
