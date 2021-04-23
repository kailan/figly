import * as Fig from "../types/fig"
import * as Fastly from "../types/fastly"

import * as child_process from "child_process"

function generate(): Fig.Spec {
  const usage: Fastly.Usage = JSON.parse(child_process.execSync('fastly help --format json').toString());

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
  return {
    name: `--${flag.name}`,
    description: flag.description
  }
}

import fs from "fs";

let output = JSON.stringify(generate(), null, 2);

let version = child_process.execSync('fastly version').toString();
version = '// ' + version.split('\n').join('\n// ')

output = `// Generated by Figly on ${new Date().toUTCString()}\n// https://github.com/kailan/figly\n${version}\nvar completionSpec = ${output}`;

fs.writeFileSync("output/fastly.js", output);
