import { useEffect } from "react";
import { useState } from "react";
import CheckBoxArray from "../../components/CheckBox/array";
import styles from "./index.module.css";
import LineGraph, {
  GraphDataType,
  DataArray,
} from "../../components/LineGraph";
import fetchapi from "../../utils/fetchapi";

interface PrefInfoType {
  prefCode: number;
  prefName: string;
}

interface PrefListType {
  [index: string]: PrefInfoType;
}

function PopulationView() {
  const [prefList, setPrefList] = useState<PrefListType>();
  const [error, setError] = useState<string>();
  const [data, setData] = useState<GraphDataType>({});

  let loadPrefListData = async () => {
    let res = await fetchapi("api/v1/prefectures");
    let msg = await res.json();
    if (!msg.message) {
      let prefArray: PrefInfoType[] = msg.result;
      let prefDict = Object.fromEntries(
        prefArray.map((info) => [info.prefCode, info])
      );
      setPrefList(prefDict);
    } else {
      setError(msg.message);
    }
  };

  let loadPopulationData = async (prefId: number) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    let res = await fetchapi(
      `api/v1/population/composition/perYear?cityCode=-&prefCode=${prefId}`
    );
    let msg = await res.json();
    let popData: DataArray = msg.result.data[0].data;

    setData((prevData) => {
      let updateData: GraphDataType = {};
      let { show, name } = prevData[prefId] || { show: false, name: "" };
      updateData[prefId] = {
        show,
        name,
        load: true,
        data: popData,
      };
      return { ...prevData, ...updateData };
    });
  };

  let callback = (prefId: number) => (checked: boolean) => {
    let prefName = prefList ? prefList[prefId].prefName : "";
    if (checked) {
      let prefData = data[prefId];
      if (prefData) {
        prefData = { ...prefData, show: true };
      } else {
        prefData = {
          show: true,
          name: prefName,
          load: false,
          promise: loadPopulationData(prefId),
        };
      }
      let updateData: GraphDataType = {};
      updateData[prefId] = prefData;
      setData({ ...data, ...updateData });
    } else {
      let prefData = data[prefId];
      if (prefData) {
        prefData = { ...prefData, show: false };
        let updateData: GraphDataType = {};
        updateData[prefId] = prefData;
        setData({ ...data, ...updateData });
      }
    }
  };

  let reload = () => {
    setPrefList(void 0);
    setError(void 0);
    setData({});
    loadPrefListData();
  };

  useEffect(() => {
    loadPrefListData();
  }, []);

  if (error)
    return (
      <div>
        {error}
        <a onClick={reload}>reload</a>
      </div>
    );
  if (!prefList) return <div>Loading.</div>;
  return (
    <div className={styles.container}>
      <div className={styles.checkboxes}>
        <CheckBoxArray
          arr={Object.entries(prefList).map(([id, { prefCode, prefName }]) => ({
            id: `pref${id}`,
            name: prefName,
            onChange: callback(prefCode),
          }))}
        />
      </div>
      <div className={styles.graph}>
        <LineGraph data={data} />
      </div>
    </div>
  );
}

export default PopulationView;
