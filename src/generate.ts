import * as Fig from "../types/fig"
import * as Fastly from "../types/fastly"

import JSON5 from "json5"

import * as child_process from "child_process"

const FASTLY_CLI = process.env.FASTLY_CLI_PATH || "fastly"

function generate(): Fig.Spec {
  const usage: Fastly.Usage = JSON.parse(child_process.execSync(`${FASTLY_CLI} help --format json`).toString());

  return {
    name: "fastly",
    description: "A CLI for interacting with the Fastly platform",
    subcommands: usage.commands.map(mapCommand),
    options: usage.globalFlags.map(mapFlag)
  }
}

function mapCommand(cmd: Fastly.Command): Fig.Subcommand {
  return {
    name: cmd.name,
    description: cmd.description,
    subcommands: cmd.children ? cmd.children.map(mapCommand) : [],
    options: cmd.flags ? cmd.flags.map(mapFlag) : []
  }
}

function mapFlag(flag: Fastly.Flag): Fig.Option {
  let opt = {
    name: `--${flag.name}`,
    description: flag.description,
    args: []
  };

  if (!flag.isBool || flag.default || flag.required) {
    opt.args.push({
      name: flag.name
    });
  }

  return opt;
}

import fs from "fs";

let output = JSON5.stringify(generate(), null, 2);

let version = child_process.execSync(`${FASTLY_CLI} version`).toString();
version = '// ' + version.split('\n').join('\n// ')

output = `// Generated by Figly on ${new Date().toUTCString()}\n// https://github.com/kailan/figly\n${version}\nconst completionSpec: Fig.Spec = ${output}\n\nexport default completionSpec;`;

fs.writeFileSync("output/fastly.ts", output);
