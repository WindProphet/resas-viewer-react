import CheckBox, { CheckBoxType } from "./index";
import styles from "./checkbox.module.css";

export interface CheckBoxArrayType {
  arr: CheckBoxType[];
  label?: string;
}

function CheckBoxArray({ arr, label }: CheckBoxArrayType) {
  return (
    <div>
      {label && <div>{label}</div>}
      <div className={styles.array}>
        {arr.map(({ id, name, onChange }) => (
          <CheckBox key={id} id={id} name={name} onChange={onChange} />
        ))}
      </div>
    </div>
  );
}

export default CheckBoxArray;
