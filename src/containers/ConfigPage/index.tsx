import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../PopulationView/index.module.css";
import configStyles from "./index.module.css";
import fetchapi from "../../utils/fetchapi";

function ConfigPage() {
  const [check, setCheck] = useState<
    "none" | "checking" | "goodapi" | "badapi"
  >("none");
  const inputElement = useRef<HTMLInputElement>(null);
  let callback: ChangeEventHandler<HTMLInputElement> = (event) => {
    localStorage.setItem("api_key", event.target.value);
    setCheck("none");
  };

  let checkAPI = async () => {
    setCheck("checking");
    try {
      let res = await fetchapi("api/v1/prefectures");
      let msg = await res.json();
      if (!msg.result[0].prefName) throw new Error("badapi");
      setCheck("goodapi");
    } catch (error) {
      setCheck("badapi");
    }
  };

  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.value = localStorage.getItem("api_key") || "";
    }
  });

  return (
    <div className={styles.fullscreen}>
      <div className={styles.banner}>RESAS Viewer React</div>
      <div className={styles.block}>
        <div style={{ textAlign: "left" }}>
          <div style={{ marginBottom: "6px" }}>API Key</div>
          <input
            readOnly={check == "checking"}
            className={configStyles.input}
            onChange={callback}
            ref={inputElement}
          />
        </div>
        <div style={{ marginTop: "15px" }}>
          <a onClick={checkAPI} href="#">
            {
              {
                none: "Check API",
                checking: "Checking",
                goodapi: "Checked",
                badapi: "Bad API",
              }[check]
            }
          </a>
          <span style={{ marginLeft: "20px" }} />
          <Link to="/">Back</Link>
        </div>
      </div>
    </div>
  );
}

export default ConfigPage;
