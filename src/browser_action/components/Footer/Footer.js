const { createElement: e } = React;

import BugReport from "../BugReport/BugReport.js";

export default function Footer() {
  return e(
    "footer",
    null,
    e("span", null, "Version " + browser.runtime.getManifest().version + " · "),
    e(BugReport, null)
  );
}
