import test from "ava";
import { LocationRepository } from "./LocationRepository";

test("cities method should respect limit option", async t => {
  const locationRepoitory = new LocationRepository();
  const { cities } = await locationRepoitory.cities({ limit: 2 });

  t.is(cities.length, 2);
});

test("cities method should filter capital cities", async t => {
  const locationRepoitory = new LocationRepository();
  const { cities } = await locationRepoitory.cities({ isCapital: true });

  cities.forEach(c => {
    t.true(c.isCapital);
  });
});
