import CheckBox, { CheckBoxType } from "./index";
import styles from "./checkbox.module.css";

export interface CheckBoxArrayType {
  /** Data of checkboxes array */
  arr: CheckBoxType[];
  /** Label for checkboxes array */
  label?: string;
}

/**
 * Component for showing array of check boxes.
 *
 * @component
 * @example
 * const label = "Choose one of check boxes"
 * const checkboxData = [
 *   { id: "checkbox_1", name: "Alice",
 *     onChange: (checked) => { data["Alice"] = checked } },
 *   { id: "checkbox_2", name: "Bob",
 *     onChange: (checked) => { checked && console.log("Bob checked") } },
 *   { id: "checkbox_3", name: "Eve" },
 * ]
 *
 * <CheckBoxArray arr={checkboxData} label={label} />
 */
function CheckBoxArray({ arr, label }: CheckBoxArrayType) {
  return (
    <div>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.array}>
        {arr.map(({ id, name, onChange }) => (
          <CheckBox key={id} id={id} name={name} onChange={onChange} />
        ))}
      </div>
    </div>
  );
}

export default CheckBoxArray;
