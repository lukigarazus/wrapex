import "jest";
import {} from "mobx";
import collection from "../collection";
import wrappex from "../wrappex";

describe("wrappex collection", () => {
  const model = wrappex([])({
    typename: "Test",
    fields: ["a"],
    init: {} as { id: number; a?: number },
  });
  model({});
  describe("basic collection works", () => {
    it("create works", () => {
      const testCol = collection(model);
      const testColInst = testCol();
      testColInst.create({ a: 2 });
      expect(testColInst.size).toEqual(1);
      expect(testColInst.map((el) => el.a)).toEqual([2]);
    });
    it("dispose for create works", () => {
      const testCol = collection(model);
      const testColInst = testCol();
      testColInst.create({ a: 2 });
      expect(testColInst.size).toEqual(1);
      expect(testColInst.map((el) => el.disposed)).toEqual([false]);
      const m = testColInst.byIndex(0);
      if (m) m.dispose();
      expect(testColInst.size).toEqual(0);
    });
    it("add works", () => {
      const testCol = collection(model);
      const testColInst = testCol();
      testColInst.add(model({ a: 2 }));
      expect(testColInst.size).toEqual(1);
      expect(testColInst.map((el) => el.a)).toEqual([2]);
    });
    it("dispose for add works", () => {
      const testCol = collection(model);
      const testColInst = testCol();
      testColInst.add(model({ a: 2 }));
      expect(testColInst.size).toEqual(1);
      expect(testColInst.map((el) => el.a)).toEqual([2]);
      const m = testColInst.byIndex(0);
      if (m) m.dispose();
      expect(testColInst.size).toEqual(0);
    });
    it("add id works", () => {
      const testCol = collection(model);
      const testColInst = testCol();
      testColInst.add(model({ a: 2 }));
      expect(Array.from(testColInst.keys()).length).toEqual(1);
      const m = testColInst.byIndex(0);
      if (m) m.id = 1;
      expect(Array.from(testColInst.keys())).toEqual([1]);
    });
  });
});
