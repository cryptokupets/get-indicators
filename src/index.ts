import _ from "lodash";
import { Transform } from "stream";
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

interface IIndicator {
  name: string;
  options: number[];
}

export function getStart({
  name,
  options
}: IIndicator): number {
  return tulind.indicators[name].start(options);
}

export function getIndicator(
  candles: ICandle[],
  indicator: IIndicator
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

export function streamCandleToIndicator(indicator: IIndicator): Transform {
  const candles = []; // нужно для накопления
  const start = getStart(indicator); // нужно для обрезания лишних данных
  const ts = new Transform({
    transform: async (chunk, encoding, callback) => {
      const candle = JSON.parse(chunk); // с объектом работает плохо
      candles.push(candle);
      if (candles.length > start) {
        const outputs = await getIndicator(candles, indicator);
        candles.shift();
        ts.push(JSON.stringify(outputs[0]));
      }
      callback();
    }
  });
  return ts;
}
