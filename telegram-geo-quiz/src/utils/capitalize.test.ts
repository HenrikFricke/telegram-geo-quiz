import test from "ava";
import { capitalize } from "./capitalize";

test("capitalize should transform the text properly", async t => {
  t.is(capitalize("germany"), "Germany");
  t.is(capitalize("northern ireland"), "Northern Ireland");
});
