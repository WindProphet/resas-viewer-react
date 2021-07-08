import styles from "./index.module.css";
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

export interface DataPoint {
  value: number;
  year: number;
}

export type DataArray = DataPoint[];

export interface GraphDataLoading {
  load: false;
  name: string;
  show: boolean;
  promise: Promise<void>;
}

export interface GraphDataReady {
  load: true;
  name: string;
  show: boolean;
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
  data: GraphDataType;
}

function LineGraph({ data }: LineGraphPropType) {
  let shownData = Object.entries(data).filter(
    ([_, el]) => el && el.show
  ) as GraphDataEntries;
  if (shownData.length == 0) return <div>no data, choose some data</div>;

  let renderData = shownData.filter(([_, el]) => el.load) as GraphReadyEntries;
  if (renderData.length == 0)
    return (
      <div>
        <div>now loading...</div>
        {shownData.map(([id, el]) => (
          <span key={id} className={styles.loadingblock}>
            {el.name}
          </span>
        ))}
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
      <div className={styles.floatinfo}></div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={arrayData}>
          <XAxis dataKey="name" />
          <YAxis />
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
    </div>
  );
}

export default LineGraph;
