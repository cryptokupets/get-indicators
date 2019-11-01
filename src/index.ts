import _ from "lodash";
import { Transform } from "stream";
// @ts-ignore
import * as tulind from "tulind";

export interface ICandle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IIndicator {
  name: string;
  options: number[];
}

export interface IBuffer {
  candle: ICandle;
  indicators: number[][];
}

export interface IAdvice {
  time?: string;
  sign: number;
  price?: number;
}

export function getStart({ name, options }: IIndicator): number {
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

export function streamCandleToBuffer(indicators: IIndicator[]): Transform {
  const candles = []; // нужно для накопления
  const start = indicators
    .map(e => getStart(e))
    .reduce((previousValue, currentValue) =>
      Math.max(previousValue, currentValue)
    ); // нужно для обрезания лишних данных
  const ts = new Transform({
    transform: async (chunk, encoding, callback) => {
      const candle = JSON.parse(chunk); // с объектом работает плохо
      candles.push(candle);
      const buffer: IBuffer = {
        candle,
        indicators: (await Promise.all(
          indicators.map(indicator =>
            getIndicator(candles.slice(-start - 1), indicator)
          )
        )).map(e => (e.length ? e[0].values : []))
      };
      ts.push(JSON.stringify(buffer));
      callback();
    }
  });
  return ts;
}

export function streamBufferToAdvice({ code }: { code: string }): Transform {
  const buffer: IBuffer[] = []; // для накопления
  const ts = new Transform({
    transform: async (chunk, encoding, callback) => {
      const bufferItem: IBuffer = JSON.parse(chunk);
      buffer.unshift(bufferItem);
      const strategyFunction = new Function("buffer", code);
      let sign: number;
      try {
        sign = strategyFunction(buffer);
      } catch (err) {
        sign = 0;
      }
      if (sign) {
        const advice: IAdvice = {
          sign
        };
        ts.push(JSON.stringify(advice));
      }
      callback();
    }
  });
  return ts;
}
