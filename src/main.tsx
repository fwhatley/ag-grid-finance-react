import React, {useState} from "react";
import ReactDOM from "react-dom/client";

import { FinanceExample } from "./FinanceExample";
import QuoteExample from "./QuoteExample.tsx";


// eslint-disable-next-line react-refresh/only-export-components
function App() {
    const [useFinancialExample, setUseFinancialExample] = useState(false)

    const buttonText = useFinancialExample? 'See Quotes Example': 'See Financial Example'
  return (
    <>
      <div>
          <div>
              <button onClick={() => setUseFinancialExample(!useFinancialExample)}>{buttonText}</button>
          </div>
        <div>
            {useFinancialExample? <FinanceExample></FinanceExample> : <QuoteExample></QuoteExample>}
        </div>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App></App>
  </React.StrictMode>
);
