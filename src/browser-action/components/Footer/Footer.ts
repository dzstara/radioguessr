import { createElement as e } from "react";
import { browser } from "webextension-polyfill-ts";

import BugReport from "../BugReport";

export default function Footer() {
  return e(
    "footer",
    null,
    e("span", null, "Version " + browser.runtime.getManifest().version + " · "),
    e(BugReport, null)
  );
}