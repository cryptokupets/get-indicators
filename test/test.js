require("mocha");
const { assert } = require("chai");
const { getStart, getIndicator } = require("../lib/index");

const candles = [];
const indicator = {
  name: "cci",
  options: [14]
}

describe("getStart", () => {
  it("getStart является сервисом", function() {
    assert.isFunction(getStart);
    const start = getStart(indicator);
    assert.isNumber(start);
  });
});

describe("getIndicator", () => {
  it("Если выполнить запрос getIndicator, то вернется массив индикаторов", function(done) {
    assert.isFunction(getIndicator);
    getIndicator(candles, indicator).then(output => {
      assert.isArray(output);
      assert.isNotEmpty(output);
      done();
    });
  });
});
