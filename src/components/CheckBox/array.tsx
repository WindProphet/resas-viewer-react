import CheckBox, { CheckBoxType } from "./index";
import styles from "./checkbox.module.css";

export interface CheckBoxArrayType {
  arr: CheckBoxType[];
}

function CheckBoxArray({ arr }: CheckBoxArrayType) {
  return (
    <div className={styles.array}>
      {arr.map(({ id, name, onChange }) => (
        <CheckBox key={id} id={id} name={name} onChange={onChange} />
      ))}
    </div>
  );
}

export default CheckBoxArray;
