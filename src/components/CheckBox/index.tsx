import { ChangeEventHandler } from "react";
import styles from "./checkbox.module.css";
import tick from "./tick.svg";

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
      <input
        className={styles.main}
        type="checkbox"
        id={id}
        onChange={callback}
      />
      <label className={styles.label} htmlFor={id}>
        <span>
          <svg width="12px" height="10px">
            <polyline
              xmlns="http://www.w3.org/2000/svg"
              points="1.5 6 4.5 9 10.5 1"
            />
          </svg>
        </span>
        <span>{name}</span>
      </label>
    </div>
  );
}

export default CheckBox;
