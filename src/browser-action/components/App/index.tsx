import React, { useEffect } from "react";

import useDisclaimer from "../../hooks/useDisclaimer";
import Disclaimer from "../Disclaimer";
import Footer from "../Footer";
import RadioControl from "../RadioControl";
import RadioStatus from "../RadioStatus";

import "./style.css";

export function App() {
  const { acknowledged, setAcknowledged } = useDisclaimer();

  useEffect(() => {
    document.body.style.width = (acknowledged ? 200 : 320) + "px";
  }, [acknowledged]);

  return (
    <div className="App">
      <h1 className="App--title">📻 RadioGuessr</h1>

      <div className="App--grid">
        {acknowledged ? (
          <>
            <RadioControl />
            <RadioStatus />
          </>
        ) : (
          <Disclaimer onAgree={setAcknowledged} />
        )}
      </div>

      <Footer />
    </div>
  );
}
