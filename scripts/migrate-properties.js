const fs = require("fs");
const path = require("path");

const readFileAsString = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return [data, null];
  } catch (err) {
    return [null, err];
  }
};

const writeFileAsString = (filePath, fileContent) => {
  try {
    fs.writeFileSync(filePath, fileContent, "utf8");
    return null;
  } catch (err) {
    return err;
  }
};

const jsonParse = (string) => {
  try {
    return [JSON.parse(string), null];
  } catch (err) {
    return [null, err];
  }
};

const [fileContent, fileContentErr] = readFileAsString(
  path.resolve(process.argv[3])
);
if (fileContentErr !== null) {
  console.error(fileContentErr);
  process.exit(1);
}

const [fileObject, fileObjectErr] = jsonParse(fileContent);
if (fileObjectErr !== null) {
  console.error(fileObjectErr);
  process.exit(1);
}

fileObject.nodes.forEach((node, nodeIndex) => {
  const propertyKeys = Object.keys(node.properties);

  if (propertyKeys.length > 0) {
    propertyKeys.forEach((propertyKey) => {
      if (
        node.properties[propertyKey].hasOwnProperty("type") &&
        node.properties[propertyKey].hasOwnProperty("value")
      ) {
        console.log(`* node[${nodeIndex}].properties[${propertyKey}]: GOOD`);
      } else {
        const propertyValue = node.properties[propertyKey];
        const propertyType = typeof JSON.parse(propertyValue);

        node.properties[propertyKey] = {
          type: propertyType,
          value: propertyValue
        };

        console.log(
          `* node[${nodeIndex}].properties[${propertyKey}]: UPDATED (${propertyType} | ${propertyValue})`
        );
      }
    });
  }
});

if (
  process.argv[2] !== "dryRun" &&
  process.argv[2] !== "dryRun".toLowerCase()
) {
  const writeFileErr = writeFileAsString(
    path.resolve(process.argv[3]),
    JSON.stringify(fileObject, null, 2)
  );
  if (writeFileErr !== null) {
    console.error(writeFileErr);
  } else {
    console.log(`Updated ${process.argv[3]}`);
  }
}
