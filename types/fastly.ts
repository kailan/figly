export interface Usage {
  globalFlags: Flag[],
  commands: Command[]
}

export interface Flag {
  name: string;
  description: string;
  placeholder: string;
  required: boolean;
  default: string;
  isBool: boolean;
}

export interface Command {
  name: string;
  description: string;
  flags: Flag[] | null;
  children: Command[] | null;
}
