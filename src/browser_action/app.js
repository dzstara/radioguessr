const { createElement: e, Fragment } = React;

import useDisclaimer from "./components/Disclaimer/useDisclaimer.js";
import Disclaimer from "./components/Disclaimer/Disclaimer.js";
import Footer from "./components/Footer/Footer.js";
import RadioControl from "./components/RadioControl/RadioControl.js";

function App() {
  const { acknowledged, setAcknowledged } = useDisclaimer();

  return e(
    Fragment,
    null,
    e("h1", null, "📻 RadioGuessr"),
    acknowledged
      ? e(RadioControl, null)
      : e(Disclaimer, { onAgree: setAcknowledged }),
    e(Footer, null)
  );
}

const domContainer = document.querySelector("#root");
ReactDOM.render(e(App), domContainer);
