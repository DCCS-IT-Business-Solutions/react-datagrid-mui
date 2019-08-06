import * as React from "react";

import { storiesOf } from "@storybook/react";

import { DataGridMui } from "../src/DataGridMui";

const sampleData1 = [
  { name: "A", number: 1 },
  { name: "B", number: 2 },
  { name: "C", number: 3 },
  { name: "D", number: 4 },
  { name: "E", number: 5 },
  { name: "F", number: 6 },
  { name: "G", number: 7 },
  { name: "H", number: 8 },
  { name: "I", number: 9 },
  { name: "J", number: 10 },
  { name: "K", number: 11 },
  { name: "L", number: 12 }
];

storiesOf("DataGridMui", module).add("simple", () => (
  <DataGridMui
    colDef={[
      { prop: "name", header: "Name" },
      { prop: "number", header: "Zahl" }
    ]}
    onLoadData={() =>
      new Promise(res => res({ total: sampleData1.length, data: sampleData1 }))
    }
  />
));
