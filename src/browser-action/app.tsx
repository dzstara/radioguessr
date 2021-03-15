import * as React from "react";
import { render } from "react-dom";
import "./style";
import useDisclaimer from "./components/Disclaimer/useDisclaimer";
import Disclaimer from "./components/Disclaimer";
import Footer from "./components/Footer/Footer";
import RadioControl from "./components/RadioControl";

function App() {
  const { acknowledged, setAcknowledged } = useDisclaimer();

  return (
    <>
      <h1>📻 RadioGuessr</h1>
      {acknowledged ? (
        <RadioControl />
      ) : (
        <Disclaimer onAgree={setAcknowledged} />
      )}
      <Footer />
    </>
  );
}

render(<App />, document.querySelector("#root"));
