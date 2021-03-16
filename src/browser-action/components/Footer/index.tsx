import * as React from "react";
import { browser } from "webextension-polyfill-ts";

import BugReport from "../BugReport";

import "./style.css";

export default function Footer() {
  return (
    <footer>
      <span>Version {browser.runtime.getManifest().version} · </span>
      <BugReport />
    </footer>
  );
}
