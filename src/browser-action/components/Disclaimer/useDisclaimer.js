import { useCallback, useEffect, useState } from "react";

export default function useDisclaimer() {
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    (async () => {
      const cache = await browser.storage.local.get("disclaimer");

      if (cache.disclaimer === true) {
        setAcknowledged(true);
      }
    })();
  }, []);

  const setAcknowledgedToTrue = useCallback(async () => {
    setAcknowledged(true);

    await browser.storage.local.set({
      disclaimer: true,
    });
  }, []);

  return {
    acknowledged,
    setAcknowledged: setAcknowledgedToTrue,
  };
}
