import { ChangeEventHandler } from "react";
import styles from "./checkbox.module.css";

export interface CheckBoxType {
  id: string;
  name: string;
  onChange?: (checked: boolean) => void;
}

function CheckBox({ id, name, onChange }: CheckBoxType) {
  let callback: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange && onChange(event.currentTarget.checked);
  };

  return (
    <div>
      <input
        className={styles.checkbox}
        type="checkbox"
        id={id}
        onChange={callback}
      />
      <label htmlFor={id}>{name}</label>
    </div>
  );
}

export default CheckBox;
