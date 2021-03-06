import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CheckBoxArray from "../../components/CheckBox/array";
import styles from "./index.module.css";
import LineGraph, {
  GraphDataType,
  DataArray,
} from "../../components/LineGraph";
import fetchapi, { throwError } from "../../utils/fetchapi";
import { LoaderRipple } from "../../components/Loaders";

interface PrefInfoType {
  prefCode: number;
  prefName: string;
}

interface PrefListType {
  [index: string]: PrefInfoType;
}

/**
 * Main page of this App, shows the population by checking each prefecture
 */
function PopulationView() {
  // prefectures data, undefined when loading
  const [prefList, setPrefList] = useState<PrefListType>();
  // error message, undefined when success
  const [error, setError] = useState<string>();
  // graph data with checking what to show, empty dictionary when start
  const [data, setData] = useState<GraphDataType>({});

  /** load prefectures list and then render the checkbox array */
  let loadPrefListData = () =>
    fetchapi("api/v1/prefectures")
      .then((res) => res.json())
      .then((res) => throwError(res))
      .then((res) =>
        Object.fromEntries(
          (res.result as PrefInfoType[]).map((info) => [info.prefCode, info])
        )
      )
      .then(setPrefList)
      .catch((err) => setError(String(err)));

  /**
   * load prefectures data and then update the graph data
   * @param prefId prefecture ID
   * @returns update the graph data, it may be shown on page when checked
   */
  let loadPopulationData = (prefId: number) =>
    fetchapi(
      `api/v1/population/composition/perYear?cityCode=-&prefCode=${prefId}`
    )
      .then((res) => res.json())
      .then((res) => throwError(res))
      .then((res) => res.result.data[0].data as DataArray)
      .then((popData) =>
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
        })
      )
      .catch((err) => setError(String(err)));

  /**
   * callback of clicking a checkbox
   *
   * which is a high order function which accept two arguments successively
   * @param prefId prefecture ID
   * @param checked whether prefecture has been checked
   * @return when checked, it will start loading data and change the interface into loading state
   */
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

  /** reload this page when error */
  let reload = () => {
    setPrefList(void 0);
    setError(void 0);
    setData({});
    loadPrefListData();
  };

  useEffect(() => {
    // load prefectures data once when start
    loadPrefListData();
  }, []);

  if (error)
    return (
      <div className={styles.fullscreen}>
        <div className={styles.banner}>RESAS Viewer React</div>
        <div className={styles.block}>
          <div className={styles.errormessage}>{error}</div>
          <div>
            <a className="button" onClick={reload}>
              Reload Page
            </a>
            <span style={{ margin: "20px" }} />
            <Link className="button" to="/config">
              Set API KEY
            </Link>
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
