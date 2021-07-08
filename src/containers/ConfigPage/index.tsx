import { ChangeEventHandler, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function ConfigPage() {
  const inputElement = useRef<HTMLInputElement>(null);
  let callback: ChangeEventHandler<HTMLInputElement> = (event) => {
    localStorage.setItem("api_key", event.target.value);
  };

  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.value = localStorage.getItem("api_key") || "";
    }
  });

  return (
    <div>
      <input onChange={callback} ref={inputElement} />
      <Link to="/">Back</Link>
    </div>
  );
}

export default ConfigPage;
