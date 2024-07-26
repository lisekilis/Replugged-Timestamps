import { Injector, /*Logger,*/ common } from "replugged";
import { findFullDate } from "./👀";

export * from "./settings";

const { messages } = common;
const inject = new Injector();
// const logger = Logger.plugin("Replugged-Timestamps");

function getTimestamp(date: Date, prefix?: string | null): string {
  const timestamp = Math.floor(date.getTime() / 1000);
  prefix ??= "t";
  const discordTimestamp = `<t:${timestamp}:${prefix}>`;
  return discordTimestamp;
}

function replaceTimestamp(content: string): string {
  const date = findFullDate(content);
  // logger.log("DATE", date);
  if (date) {
    if (date.length == 0)
      return `${content.slice(0, date.nextIndex)}${replaceTimestamp(content.slice(date.index, content.length))}`;
    return `${content[date.index - 1] == "\\" ? `${content.slice(0, date.index - 1)}${content.slice(date.index, date.nextIndex)}${replaceTimestamp(content.slice(date.nextIndex, content.length))}` : `${content.slice(0, date.index)}${getTimestamp(date.date, date.prefix)}${replaceTimestamp(content.slice(date.nextIndex))}`}`;
  }
  return content;
}
// eslint-disable-next-line @typescript-eslint/require-await
export async function start(): Promise<void> {
  inject.before(messages, "sendMessage", (_args) => {
    _args[1].content = replaceTimestamp(_args[1].content);
    return _args;
  });
  inject.before(messages, "editMessage", (_args) => {
    _args[2].content = replaceTimestamp(_args[2].content);
    return _args;
  });
}
export function stop(): void {
  inject.uninjectAll();
}
