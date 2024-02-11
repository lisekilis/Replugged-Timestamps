import { settings } from "replugged";

interface Settings {
  prefix?: boolean;
  format?: string;
  shortYear?: boolean;
}

const defaultSettings = {
  prefix: true,
  format: "dmy",
  shortYear: false,
} satisfies Partial<Settings>;

export const cfg = await settings.init<Settings, keyof typeof defaultSettings>(
  "dev.lisekilis.RepluggedTimestamps",
  defaultSettings,
);
