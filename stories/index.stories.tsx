import * as React from "react";

import { storiesOf } from "@storybook/react";

import {
  DataGridPlain,
  createJsonServerSource
} from "@dccs/react-datagrid-plain";
import { datagridMuiTheme } from "../src/DataGridMui";

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

storiesOf("DataGridMui", module)
  .add("simple", () => (
    <DataGridPlain
      {...datagridMuiTheme}
      texts={{
        errorText: "ERRORY"
      }}
      colDef={[
        { prop: "name", header: "Name" },
        { prop: "number", header: "Zahl" }
      ]}
      onLoadData={() =>
        new Promise(res =>
          res({ total: sampleData1.length, data: sampleData1 })
        )
      }
    />
  ))
  .add("from json-server", () => (
    <DataGridPlain
      {...datagridMuiTheme}
      colDef={[
        { prop: "name", header: "Name" },
        { prop: "number", header: "Zahl" }
      ]}
      onLoadData={createJsonServerSource(
        url => fetch(url).then(r => r.json()),
        "http://localhost:5000/dummies"
      )}
    />
  ));
