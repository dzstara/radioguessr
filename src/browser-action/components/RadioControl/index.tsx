import React from "react";
import classnames from "classnames";

import { StatusData } from "../../../types";
import { useStatus } from "../../contexts/StatusContext";

export default function RadioControl() {
  const { state, togglePlay } = useStatus();
  const buttonData = getButtonData(state);

  return (
    <div
      className={classnames("btn", buttonData.className)}
      onClick={togglePlay}
    >
      {buttonData.text}
    </div>
  );
}

function getButtonData(state: StatusData) {
  if (state.intent && state.country === null)
    return { text: "waiting...", className: "btn-info" };
  if (state.intent && state.country !== null && !state.playing)
    return { text: "loading", className: "btn-info" };
  if (state.intent && !state.loading)
    return { text: "stop", className: "btn-bad" };
  return { text: "start", className: "btn-good" };
}
