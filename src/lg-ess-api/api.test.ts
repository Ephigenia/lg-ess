// use node buildin test runner: https://glebbahmutov.com/blog/trying-node-test-runner/#test-reporters
import assert from "node:assert";
import { describe, it } from "node:test";
import { LgEssApi } from "./api";

describe('LG ESS', () => {
  describe('constructor', () => {
    it('throws an error when IP is not passed', () => {
      assert.throws(() => { new LgEssApi(''); });
      assert.throws(() => { new LgEssApi((null as never) as string); });
    });
  });
});
