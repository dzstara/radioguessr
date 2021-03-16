import * as React from "react";

import useDisclaimer from "../../hooks/useDisclaimer";
import Disclaimer from "../Disclaimer";
import Footer from "../Footer";
import RadioControl from "../RadioControl";
import RadioStatus from "../RadioStatus";

import "./style.css";

export function App() {
  const { acknowledged, setAcknowledged } = useDisclaimer();

  return (
    <>
      <h1>📻 RadioGuessr</h1>

      {acknowledged ? (
        <>
          <RadioControl />
          <RadioStatus />
        </>
      ) : (
        <Disclaimer onAgree={setAcknowledged} />
      )}

      <Footer />
    </>
  );
}
