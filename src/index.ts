import _ from "lodash";
// @ts-ignore
import * as tulind from "tulind";

interface ICandle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export function getStart({
  name,
  options
}: {
  name: string;
  options: number[];
}): number {
  return tulind.indicators[name].start(options);
}

export function getIndicator(
  candles: ICandle[],
  indicator: { name: string; options: number[] }
): Promise<Array<{ time: string; values: number[] }>> {
  return (tulind.indicators[indicator.name].indicator(
    (tulind.indicators[indicator.name].input_names as string[])
      .map(e => (e === "real" ? "close" : e))
      .map(e => candles.map(c => (c as any)[e])),
    indicator.options
  ) as Promise<number[][]>).then(output => {
    const timesReversed = candles.map(e => e.time).reverse();
    return _.unzip(output)
      .reverse()
      .map((e, i) => {
        return { time: timesReversed[i], values: e };
      })
      .reverse();
  });
}
