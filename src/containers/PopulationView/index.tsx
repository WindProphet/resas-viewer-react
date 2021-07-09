import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CheckBoxArray from "../../components/CheckBox/array";
import styles from "./index.module.css";
import LineGraph, {
  GraphDataType,
  DataArray,
} from "../../components/LineGraph";
import fetchapi, { checkError } from "../../utils/fetchapi";
import { LoaderRipple } from "../../components/Loaders";

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
    let error = checkError(msg);
    if (error) {
      setError(error);
      return;
    }
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
    let res = await fetchapi(
      `api/v1/population/composition/perYear?cityCode=-&prefCode=${prefId}`
    );
    let msg = await res.json();
    let error = checkError(msg);
    if (error) {
      setError(error);
      return;
    }
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
      <div className={styles.fullscreen}>
        <div className={styles.banner}>RESAS Viewer React</div>
        <div className={styles.block}>
          <div className={styles.errormessage}>{error}</div>
          <div>
            <a onClick={reload} href="#">
              Reload Page
            </a>
            <span style={{ margin: "20px" }} />
            <Link to="/config">Set API KEY</Link>
          </div>
        </div>
      </div>
    );
  if (!prefList)
    return (
      <div className={styles.fullscreen}>
        <div className={styles.banner}>RESAS Viewer React</div>
        <div className={styles.block}>
          <div style={{ margin: "30px" }}>
            <LoaderRipple />
          </div>
        </div>
        <div>
          <span>Loading</span> prefectures data...
        </div>
      </div>
    );
  return (
    <div className={styles.container}>
      <div className={styles.banner}>RESAS Viewer React</div>
      <div className={styles.checkboxes}>
        <CheckBoxArray
          arr={Object.entries(prefList).map(([id, { prefCode, prefName }]) => ({
            id: `pref${id}`,
            name: prefName,
            onChange: callback(prefCode),
          }))}
          label="Prefectures"
        />
      </div>
      <div className={styles.graph}>
        <LineGraph data={data} />
      </div>
    </div>
  );
}

export default PopulationView;
