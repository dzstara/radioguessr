import React from "react";
import Slider from "rc-slider";

import { useStatus } from "../../contexts/StatusContext";

import "./style.css";
import { Icon } from "../Icon";

export default function RadioVolume() {
  const { state, setVolume } = useStatus();

  return (
    <div className="RadioVolume">
      <div className="RadioVolume--icon">
        <Icon name="volume_up" />
      </div>
      <div className="RadioVolume--slider">
        <Slider
          min={0}
          max={1}
          step={0.001}
          value={state.volume}
          onChange={setVolume}
        />
      </div>
    </div>
  );
}
