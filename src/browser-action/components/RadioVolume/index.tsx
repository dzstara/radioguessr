import React from "react";
import Slider from "rc-slider";

import { useStatus } from "../../contexts/StatusContext";

import "./style.css";

export default function RadioVolume() {
  const { state, setVolume } = useStatus();

  return (
    <Slider
      min={0}
      max={1}
      step={0.001}
      value={state.volume}
      onChange={setVolume}
    />
  );
}
