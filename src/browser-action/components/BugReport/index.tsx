import * as React from "react";
import { browser } from "webextension-polyfill-ts";

import "./style.css";

export default function BugReport() {
  const onClick = () => {
    browser.tabs.create({
      url: "https://github.com/dzstara/radioguessr/issues/new/choose",
      active: true,
    });
  };

  return (
    <span className="Report" onClick={onClick}>
      Report a bug
    </span>
  );
}
