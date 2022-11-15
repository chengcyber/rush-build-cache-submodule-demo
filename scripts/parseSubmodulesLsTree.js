const { spawnSync } = require("child_process");
const os = require("os");

const result1 = spawnSync("git", ["submodule", "status"], {
  encoding: "utf-8",
});

const submodulePaths = getSubmodulePaths(result1.stdout);
console.log(submodulePaths);

const result = spawnSync(
  "git",
  [
    "submodule",
    "foreach",
    "git",
    "--no-optional-locks",
    "ls-tree",
    "-r",
    "--full-name",
    "HEAD",
    "--",
  ],
  {
    encoding: "utf8",
  }
);

const output = result.stdout;

const ret = getSubmodulesLsTreeOutput(output);
console.log(ret);

function getSubmodulesLsTreeOutput(output) {
  const submoduleFolder2LsTreeOutput = {};

  let currentSubmoduleFolder = "";

  // Enter '<submoduleFolder>'...\n
  // <hash> <path> (heads/main)\n
  output.split(os.EOL).forEach((line) => {
    if (line) {
      line = line.trim();
      submoduleFolder = line.match(/'(.*)'/)?.[1];
      if (submoduleFolder) {
        currentSubmoduleFolder = submoduleFolder;
      } else {
        const tabIndex = line.indexOf("\t");
        const filePath = line.slice(tabIndex + 1);

        // The newHash will be all zeros if the file is deleted, or a hash if it exists
        const hash = line.slice(tabIndex - 40, tabIndex);
        submoduleFolder2LsTreeOutput[currentSubmoduleFolder] = {
          ...submoduleFolder2LsTreeOutput[currentSubmoduleFolder],
          [filePath]: hash,
        };
      }
    }
  });

  return submoduleFolder2LsTreeOutput;
}

function getSubmodulePaths(output) {
  const submodulePaths = [];

  // <hash> <path> (heads/main)\n
  output.split(os.EOL).map((line) => {
    if (line) {
      const [_hash, submoduleFolder] = line.trim().split(" ");
      submodulePaths.push(submoduleFolder);
    }
  });
  return submodulePaths;
}
