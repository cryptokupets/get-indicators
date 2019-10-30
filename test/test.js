require("mocha");
const { assert } = require("chai");
const { Readable } = require("stream");
const { readFileSync } = require("fs");

const {
  getStart,
  getIndicator,
  streamCandleToIndicator,
  streamCandleToBuffer
} = require("../lib/index");

describe("getStart", () => {
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

describe("getIndicator", () => {
  it("Если выполнить запрос getIndicator, то вернется массив индикаторов", function(done) {
    assert.isFunction(getIndicator);

    const candles = JSON.parse(readFileSync("./test/data/candles0.json"));

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
    const candles = JSON.parse(readFileSync("./test/data/candles1.json"));

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
      const output = JSON.parse(chunk);
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

describe("streamCandleToBuffer", () => {
  it("буфер с одним индикатором", function(done) {
    assert.isFunction(streamCandleToBuffer);

    const candles = JSON.parse(readFileSync("./test/data/candles2.json"));

    const rs = new Readable({
      read: async () => {
        rs.push(candles.length ? JSON.stringify(candles.shift()) : null);
      }
    });

    const indicators = [
      {
        name: "cci",
        options: [3]
      }
    ];

    let i = 0;

    const ts = streamCandleToBuffer(indicators);
    rs.pipe(ts);
    ts.on("data", chunk => {
      ++i;
      const output = JSON.parse(chunk);
      assert.isObject(output);
      assert.hasAllKeys(output, ["candle", "indicators"]);
      assert.equal(indicators.length, 1);
      const indicator = output.indicators[0];

      if (indicator.length) {
        assert.isArray(indicator);
        assert.isNotEmpty(indicator);
        assert.equal(indicator.length, 1);
        assert.isNumber(indicator[0]);
      }
    });

    ts.on("finish", () => {
      done();
    });
  });

  it("буфер с двумя индикаторами разной длины", function(done) {
    assert.isFunction(streamCandleToBuffer);

    const candles = JSON.parse(readFileSync("./test/data/candles2.json"));

    const rs = new Readable({
      read: async () => {
        rs.push(candles.length ? JSON.stringify(candles.shift()) : null);
      }
    });

    const indicators = [
      {
        name: "cci",
        options: [2]
      },
      {
        name: "max",
        options: [4]
      }
    ];

    let i = 0;

    const ts = streamCandleToBuffer(indicators);
    rs.pipe(ts);
    ts.on("data", chunk => {
      ++i;
      const output = JSON.parse(chunk);
      assert.isObject(output);
      assert.hasAllKeys(output, ["candle", "indicators"]);
      assert.equal(indicators.length, 2);
      let indicator = output.indicators[0];

      if (indicator.length) {
        assert.isArray(indicator);
        assert.isNotEmpty(indicator);
        assert.equal(indicator.length, 1);
        assert.isNumber(indicator[0]);
      }

      indicator = output.indicators[1];

      if (indicator.length) {
        assert.isArray(indicator);
        assert.isNotEmpty(indicator);
        assert.equal(indicator.length, 1);
        assert.isNumber(indicator[0]);
      }
    });

    ts.on("finish", () => {
      done();
    });
  });
});
