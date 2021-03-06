import styles from "./index.module.css";
import "./index.css";
import stringToColor from "../../utils/stringHashColor";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { LoaderRipple, LoaderDualRing } from "../Loaders";

export interface DataPoint {
  /** Y axis data */
  value: number;
  /** X axis data */
  year: number;
}

export type DataArray = DataPoint[];

export interface GraphDataLoading {
  /** is this data still loading */
  load: false;
  /** prefecture name */
  name: string;
  /** whether this data should be shown */
  show: boolean;
  /** async function for loading */
  promise: Promise<void>;
}

export interface GraphDataReady {
  /** is this data still loading */
  load: true;
  /** prefecture name */
  name: string;
  /** whether this data should be shown */
  show: boolean;
  /** data points */
  data: DataArray;
}

export type GraphDataBlock = GraphDataReady | GraphDataLoading;

type GraphDataEntries = [string, GraphDataBlock][];
type GraphReadyEntries = [string, GraphDataReady][];
type GraphDict = { [year: string]: { [index: string]: number } };

export interface GraphDataType {
  [index: string]: GraphDataBlock | undefined;
}

export interface LineGraphPropType {
  /**
   * Data for `LineGraph` Component
   *
   * `GraphDataType` is a dictionary where
   *   prefectures names are keys and
   *   prefectures population data are values
   *
   * Prefectures population data is defined as `GraphDataBlock` which is optional
   * @param {boolean} show means whether this data will be shown on screen
   * @param {boolean} load means whether this data has been fetched already
   * @param {string} name means the showing name of this prefecture
   * @param {Promise<void>} promise exists when data is loading
   * @param {DataArray} data keeps the population data points
   *
   */
  data: GraphDataType;
}

/**
 * Component for showing population line chart
 *
 * @component
 * @example
 * const data = {
 *   "1": { show: true, load: false, name: "Hokkaido", promise: <pending...> },
 *   "2": { show: true, load: true, name: "Aomori", data: [
 *     { value: 100, year: 1960 },
 *     { value: 100, year: 1970 },
 *   ] }
 * }
 */
function LineGraph({ data }: LineGraphPropType) {
  let shownData = Object.entries(data).filter(
    ([_, el]) => el && el.show
  ) as GraphDataEntries;
  if (shownData.length == 0)
    return (
      <div className={styles.loading}>
        <span>Check prefectures for showing graph</span>
      </div>
    );

  let renderData = shownData.filter(([_, el]) => el.load) as GraphReadyEntries;
  if (renderData.length == 0)
    return (
      <div className={styles.loading}>
        <div style={{ display: "block", textAlign: "center" }}>
          <div style={{ margin: "30px" }}>
            <LoaderRipple />
          </div>
          <div>
            Loading Population Info:{" "}
            {shownData.map(([id, el]) => (
              <span key={id} className={styles.loadingblock}>
                {el.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    );

  let mapData = renderData.reduce((m, [id, el]) => {
    el.data.forEach((entry) => {
      m[entry.year] = {
        ...m[entry.year],
        ...Object.fromEntries([[id, entry.value]]),
      };
    });
    return m;
  }, {} as GraphDict);
  let arrayData = Object.entries(mapData).map(([year, el]) => ({
    name: year,
    ...el,
  }));

  return (
    <div className={styles.graph}>
      <div className={styles.floatinfo}>
        {Object.entries(data).map(
          ([id, el]) =>
            el &&
            el.show &&
            !el.load && (
              <div key={id} className={styles.loadingentry}>
                <LoaderDualRing color={stringToColor(el.name)} />
                <span
                  className={styles.text}
                  data-testid={"graph-loading-" + id}
                >
                  {el.name}
                </span>
              </div>
            )
        )}
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={arrayData}
          margin={{
            top: 25,
            right: 30,
            left: 25,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            label={{
              value: "Year",
              position: "insideBottomRight",
              offset: -10,
            }}
          />
          <YAxis
            width={35}
            label={{
              value: "Population",
              position: "insideTopLeft",
              offset: -25,
            }}
          />
          <Tooltip />
          <Legend />
          {Object.entries(data).map(
            ([id, el]) =>
              el &&
              el.load &&
              el.show && (
                <Line
                  key={id}
                  name={el.name}
                  type="monotone"
                  dataKey={id}
                  stroke={stringToColor(el.name)}
                />
              )
          )}
        </LineChart>
      </ResponsiveContainer>
      <div className={styles.metadata}>
        {Object.entries(data).map(
          ([id, el]) =>
            el &&
            el.show && (
              <span key={id} data-testid={"graph-" + id}>
                {el.name}
              </span>
            )
        )}
      </div>
    </div>
  );
}

export default LineGraph;
