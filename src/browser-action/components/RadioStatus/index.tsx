import React from "react";
import classnames from "classnames";
import { useStatus } from "../../contexts/StatusContext";

export default function RadioStatus() {
  const { state } = useStatus();

  return (
    <>
      <div
        className={classnames("data", {
          "data-bad": state.country === null,
          "data-good": state.country !== null,
        })}
      >
        {state.country === null ? "No position found" : "Position found"}
      </div>

      <div
        className={classnames("data", {
          "data-info":
            state.country !== null && state.intent && state.radio === null,
          "data-good":
            state.country !== null && state.intent && state.radio !== null,
        })}
      >
        {state.country === null || !state.intent
          ? "Radio on standby"
          : state.intent && state.radio === null
          ? "Seeking a radio..."
          : "Radio found"}
      </div>
    </>
  );
}
