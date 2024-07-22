import { settings } from "replugged";

interface Settings {
  prefix?: boolean;
  defaultPrefix?: string;
  format?: string;
  shortYear?: boolean;
}

const defaultSettings = {
  prefix: true,
  defaultPrefix: "t",
  format: "dmy",
  shortYear: true,
} satisfies Partial<Settings>;

export const cfg = await settings.init<Settings, keyof typeof defaultSettings>(
  "dev.lisekilis.RepluggedTimestamps",
  defaultSettings,
);
