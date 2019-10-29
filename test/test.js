require("mocha");
const { assert } = require("chai");
const { Readable } = require("stream");

const {
  getStart,
  getIndicator,
  streamCandleToIndicator,
  streamCandleToBuffer
} = require("../lib/index");

describe.skip("getStart", () => {
  it("getStart является сервисом", function() {
    assert.isFunction(getStart);

    const indicator = {
      name: "cci",
      options: [14]
    };

    const start = getStart(indicator);
    assert.isNumber(start);
  });
});

describe.skip("getIndicator", () => {
  it("Если выполнить запрос getIndicator, то вернется массив индикаторов", function(done) {
    assert.isFunction(getIndicator);

    const candles = [
      {
        time: "2019-09-01T00:00:00.000Z",
        open: 9589.22,
        high: 9631.51,
        low: 9587.54,
        close: 9612.04,
        volume: 138.14399
      },
      {
        time: "2019-09-01T01:00:00.000Z",
        open: 9612.04,
        high: 9643.38,
        low: 9608.57,
        close: 9613.17,
        volume: 91.31475
      },
      {
        time: "2019-09-01T02:00:00.000Z",
        open: 9613.23,
        high: 9623.06,
        low: 9600.9,
        close: 9606.76,
        volume: 97.84439
      },
      {
        time: "2019-09-01T03:00:00.000Z",
        open: 9609.83,
        high: 9629.61,
        low: 9609.83,
        close: 9628.54,
        volume: 60.80362
      },
      {
        time: "2019-09-01T04:00:00.000Z",
        open: 9628.84,
        high: 9637.57,
        low: 9613,
        close: 9616.12,
        volume: 955.22616
      },
      {
        time: "2019-09-01T05:00:00.000Z",
        open: 9616.25,
        high: 9619.46,
        low: 9600.29,
        close: 9600.29,
        volume: 764.74696
      },
      {
        time: "2019-09-01T06:00:00.000Z",
        open: 9601.35,
        high: 9621.38,
        low: 9596.11,
        close: 9613.12,
        volume: 1002.11586
      },
      {
        time: "2019-09-01T07:00:00.000Z",
        open: 9613.52,
        high: 9625.47,
        low: 9607.07,
        close: 9610.49,
        volume: 764.80921
      },
      {
        time: "2019-09-01T08:00:00.000Z",
        open: 9610.49,
        high: 9610.53,
        low: 9542.77,
        close: 9587.19,
        volume: 3749.24545
      },
      {
        time: "2019-09-01T09:00:00.000Z",
        open: 9586.05,
        high: 9607.33,
        low: 9560.38,
        close: 9586.38,
        volume: 1996.77809
      },
      {
        time: "2019-09-01T10:00:00.000Z",
        open: 9586.15,
        high: 9598.76,
        low: 9564.44,
        close: 9582.25,
        volume: 901.64466
      },
      {
        time: "2019-09-01T11:00:00.000Z",
        open: 9582.1,
        high: 9593.7,
        low: 9564.48,
        close: 9569.49,
        volume: 989.27482
      },
      {
        time: "2019-09-01T12:00:00.000Z",
        open: 9569.6,
        high: 9587.78,
        low: 9559.01,
        close: 9573.67,
        volume: 965.4279
      },
      {
        time: "2019-09-01T13:00:00.000Z",
        open: 9573.58,
        high: 9583.63,
        low: 9544.59,
        close: 9563.39,
        volume: 1577.20962
      },
      {
        time: "2019-09-01T14:00:00.000Z",
        open: 9563.95,
        high: 9584.99,
        low: 9554.96,
        close: 9582.01,
        volume: 959.04199
      },
      {
        time: "2019-09-01T15:00:00.000Z",
        open: 9582.01,
        high: 9656.63,
        low: 9566.3,
        close: 9602.38,
        volume: 1580.20996
      },
      {
        time: "2019-09-01T16:00:00.000Z",
        open: 9604.09,
        high: 9608.05,
        low: 9549.42,
        close: 9575.53,
        volume: 1045.99172
      },
      {
        time: "2019-09-01T17:00:00.000Z",
        open: 9575.31,
        high: 9622.48,
        low: 9522.18,
        close: 9584.12,
        volume: 979.33698
      },
      {
        time: "2019-09-01T18:00:00.000Z",
        open: 9583.96,
        high: 9610.54,
        low: 9578.03,
        close: 9593.2,
        volume: 561.26162
      },
      {
        time: "2019-09-01T19:00:00.000Z",
        open: 9593.03,
        high: 9637.69,
        low: 9580.16,
        close: 9614.31,
        volume: 270.67193
      },
      {
        time: "2019-09-01T20:00:00.000Z",
        open: 9614.09,
        high: 9626.25,
        low: 9596.12,
        close: 9619.49,
        volume: 231.11537
      },
      {
        time: "2019-09-01T21:00:00.000Z",
        open: 9619.5,
        high: 9777,
        low: 9619.5,
        close: 9683.63,
        volume: 2017.2074
      },
      {
        time: "2019-09-01T22:00:00.000Z",
        open: 9685.41,
        high: 9824.37,
        low: 9685.41,
        close: 9775.27,
        volume: 1364.82622
      },
      {
        time: "2019-09-01T23:00:00.000Z",
        open: 9779.3,
        high: 9801.08,
        low: 9716.23,
        close: 9735.3,
        volume: 613.18227
      },
      {
        time: "2019-09-02T00:00:00.000Z",
        open: 9732.82,
        high: 9759.3,
        low: 9724.27,
        close: 9743.86,
        volume: 326.30169
      },
      {
        time: "2019-09-02T01:00:00.000Z",
        open: 9742.82,
        high: 9749.62,
        low: 9731.09,
        close: 9739.36,
        volume: 103.25543
      },
      {
        time: "2019-09-02T02:00:00.000Z",
        open: 9740.94,
        high: 9773.64,
        low: 9730.01,
        close: 9767.73,
        volume: 515.02087
      }
    ];

    const indicator = {
      name: "cci",
      options: [14]
    };

    getIndicator(candles, indicator).then(output => {
      assert.isArray(output);
      assert.isNotEmpty(output);
      assert.equal(output.length, 1);
      const indicator = output[0];
      assert.hasAllKeys(indicator, ["time", "values"]);
      assert.isString(indicator.time);
      assert.isArray(indicator.values);
      assert.isNotEmpty(indicator.values);
      assert.isNumber(indicator.values[0]);

      done();
    });
  });
});

describe("streamCandleToIndicator", () => {
  it("streamCandleToIndicator", function(done) {
    assert.isFunction(streamCandleToIndicator);
    const candles = [
      {
        time: "2019-09-01T00:00:00.000Z",
        open: 9589.22,
        high: 9631.51,
        low: 9587.54,
        close: 9612.04,
        volume: 138.14399
      },
      {
        time: "2019-09-01T01:00:00.000Z",
        open: 9612.04,
        high: 9643.38,
        low: 9608.57,
        close: 9613.17,
        volume: 91.31475
      },
      {
        time: "2019-09-01T02:00:00.000Z",
        open: 9613.23,
        high: 9623.06,
        low: 9600.9,
        close: 9606.76,
        volume: 97.84439
      },
      {
        time: "2019-09-01T03:00:00.000Z",
        open: 9609.83,
        high: 9629.61,
        low: 9609.83,
        close: 9628.54,
        volume: 60.80362
      },
      {
        time: "2019-09-01T04:00:00.000Z",
        open: 9628.84,
        high: 9637.57,
        low: 9613,
        close: 9616.12,
        volume: 955.22616
      },
      {
        time: "2019-09-01T05:00:00.000Z",
        open: 9616.25,
        high: 9619.46,
        low: 9600.29,
        close: 9600.29,
        volume: 764.74696
      },
      {
        time: "2019-09-01T06:00:00.000Z",
        open: 9601.35,
        high: 9621.38,
        low: 9596.11,
        close: 9613.12,
        volume: 1002.11586
      },
      {
        time: "2019-09-01T07:00:00.000Z",
        open: 9613.52,
        high: 9625.47,
        low: 9607.07,
        close: 9610.49,
        volume: 764.80921
      },
      {
        time: "2019-09-01T08:00:00.000Z",
        open: 9610.49,
        high: 9610.53,
        low: 9542.77,
        close: 9587.19,
        volume: 3749.24545
      },
      {
        time: "2019-09-01T09:00:00.000Z",
        open: 9586.05,
        high: 9607.33,
        low: 9560.38,
        close: 9586.38,
        volume: 1996.77809
      },
      {
        time: "2019-09-01T10:00:00.000Z",
        open: 9586.15,
        high: 9598.76,
        low: 9564.44,
        close: 9582.25,
        volume: 901.64466
      },
      {
        time: "2019-09-01T11:00:00.000Z",
        open: 9582.1,
        high: 9593.7,
        low: 9564.48,
        close: 9569.49,
        volume: 989.27482
      },
      {
        time: "2019-09-01T12:00:00.000Z",
        open: 9569.6,
        high: 9587.78,
        low: 9559.01,
        close: 9573.67,
        volume: 965.4279
      },
      {
        time: "2019-09-01T13:00:00.000Z",
        open: 9573.58,
        high: 9583.63,
        low: 9544.59,
        close: 9563.39,
        volume: 1577.20962
      },
      {
        time: "2019-09-01T14:00:00.000Z",
        open: 9563.95,
        high: 9584.99,
        low: 9554.96,
        close: 9582.01,
        volume: 959.04199
      },
      {
        time: "2019-09-01T15:00:00.000Z",
        open: 9582.01,
        high: 9656.63,
        low: 9566.3,
        close: 9602.38,
        volume: 1580.20996
      },
      {
        time: "2019-09-01T16:00:00.000Z",
        open: 9604.09,
        high: 9608.05,
        low: 9549.42,
        close: 9575.53,
        volume: 1045.99172
      },
      {
        time: "2019-09-01T17:00:00.000Z",
        open: 9575.31,
        high: 9622.48,
        low: 9522.18,
        close: 9584.12,
        volume: 979.33698
      },
      {
        time: "2019-09-01T18:00:00.000Z",
        open: 9583.96,
        high: 9610.54,
        low: 9578.03,
        close: 9593.2,
        volume: 561.26162
      },
      {
        time: "2019-09-01T19:00:00.000Z",
        open: 9593.03,
        high: 9637.69,
        low: 9580.16,
        close: 9614.31,
        volume: 270.67193
      },
      {
        time: "2019-09-01T20:00:00.000Z",
        open: 9614.09,
        high: 9626.25,
        low: 9596.12,
        close: 9619.49,
        volume: 231.11537
      },
      {
        time: "2019-09-01T21:00:00.000Z",
        open: 9619.5,
        high: 9777,
        low: 9619.5,
        close: 9683.63,
        volume: 2017.2074
      },
      {
        time: "2019-09-01T22:00:00.000Z",
        open: 9685.41,
        high: 9824.37,
        low: 9685.41,
        close: 9775.27,
        volume: 1364.82622
      },
      {
        time: "2019-09-01T23:00:00.000Z",
        open: 9779.3,
        high: 9801.08,
        low: 9716.23,
        close: 9735.3,
        volume: 613.18227
      },
      {
        time: "2019-09-02T00:00:00.000Z",
        open: 9732.82,
        high: 9759.3,
        low: 9724.27,
        close: 9743.86,
        volume: 326.30169
      },
      {
        time: "2019-09-02T01:00:00.000Z",
        open: 9742.82,
        high: 9749.62,
        low: 9731.09,
        close: 9739.36,
        volume: 103.25543
      },
      {
        time: "2019-09-02T02:00:00.000Z",
        open: 9740.94,
        high: 9773.64,
        low: 9730.01,
        close: 9767.73,
        volume: 515.02087
      },
      {
        time: "2019-09-02T03:00:00.000Z",
        open: 9740.94,
        high: 9773.64,
        low: 9730.01,
        close: 9767.73,
        volume: 515.02087
      }
    ];

    const rs = new Readable({
      read: async () => {
        rs.push(candles.length ? JSON.stringify(candles.shift()) : null);
      }
    });

    const indicator = {
      name: "cci",
      options: [14]
    };

    let i = 0;

    const ts = streamCandleToIndicator(indicator);
    rs.pipe(ts);
    ts.on("data", chunk => {
      const output = JSON.parse(chunk.toString());
      assert.isObject(output);
      assert.hasAllKeys(output, ["time", "values"]);
      assert.isString(output.time);
      assert.isArray(output.values);
      assert.isNotEmpty(output.values);
      assert.equal(output.values.length, 1);
      assert.isNumber(output.values[0]);
      i++;
    });

    ts.on("finish", () => {
      assert.equal(i, 2);
      done();
    });
  });
});

describe.skip("streamCandleToBuffer", () => {
  it("streamCandleToBuffer", function(done) {
    assert.isFunction(streamCandleToBuffer);
    //
    done();
  });
});
