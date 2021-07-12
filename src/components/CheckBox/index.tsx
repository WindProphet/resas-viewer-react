import { ChangeEventHandler } from "react";
import styles from "./checkbox.module.css";

export interface CheckBoxType {
  /** checkbox ID also DOM Element ID */
  id: string;
  /** checkbox name shown on page */
  name: string;
  /** (optional) callback function triggered on changing of value */
  onChange?: (checked: boolean) => void;
}

/**
 * Component for checkbox element with a callback
 *
 * @component
 * @example
 * <CheckBox id="checkbox_1" name="Alice"
 *           onChange={ (checked: boolean) => {...} } />
 */
function CheckBox({ id, name, onChange }: CheckBoxType) {
  let callback: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange && onChange(event.currentTarget.checked);
  };

  return (
    <div className={styles.checkbox}>
      <input type="checkbox" id={id} onChange={callback} />
      <label htmlFor={id}>{name}</label>
    </div>
  );
}

export default CheckBox;
