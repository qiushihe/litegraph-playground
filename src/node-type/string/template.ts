import flow from "lodash/fp/flow";
import times from "lodash/fp/times";
import identity from "lodash/fp/identity";
import reduce from "lodash/fp/reduce";

import BaseNode, { dataSocket } from "../base-node";

const TITLE = "Template";

const VALUES_COUNT = 5;

const dynamicTemplate = (
  template: string,
  variables: Record<string, unknown>
): string => {
  return template.replace(/\${(.*?)}/g, (_, name) => variables[name] as string);
};

class TemplateNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [
          dataSocket("template"),
          ...times((index) => dataSocket(`val${index}`))(VALUES_COUNT)
        ],
        output: [dataSocket("string")]
      }
    });

    this.resizable = false;
  }

  onExecute() {
    const template = this.getInputDataOr<string>("", 0);

    const values = flow([
      times(identity),
      reduce(
        (acc, index: number) => ({
          ...acc,
          [`val${index}`]: this.getInputData(index + 1)
        }),
        {}
      )
    ])(VALUES_COUNT);

    this.setOutputData(0, dynamicTemplate(template, values));
  }
}

export default TemplateNode;
