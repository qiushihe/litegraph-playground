import flow from "lodash/fp/flow";
import times from "lodash/fp/times";
import identity from "lodash/fp/identity";
import reduce from "lodash/fp/reduce";

const nodeType = {
  title: "Template",
  defaultClass: null
};

const VALUES_COUNT = 5;

const dynamicTemplate = (template, variables) =>
  template.replace(/\${(.*?)}/g, (_, name) => variables[name]);

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("template", "");

        times((index) => {
          this.addInput(`val${index}`, "");
        })(VALUES_COUNT);

        this.addOutput("string", "");

        this.resizable = false;
      }

      onExecute() {
        const template = this.getInputData(0);

        const values = flow([
          times(identity),
          reduce(
            (acc, index) => ({
              ...acc,
              [`val${index}`]: this.getInputData(index + 1)
            }),
            {}
          )
        ])(VALUES_COUNT);

        this.setOutputData(0, dynamicTemplate(template, values));
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
