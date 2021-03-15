import { createElement as e, Fragment } from "react";
import { render } from "react-dom";
import "./style";
import useDisclaimer from "./components/Disclaimer/useDisclaimer";
import Disclaimer from "./components/Disclaimer";
import Footer from "./components/Footer/Footer";
import RadioControl from "./components/RadioControl";

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

render(e(App), document.querySelector("#root"));
