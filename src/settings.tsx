import { components, settings, util } from "replugged";

const { Clickable, Category, Divider, Flex, SwitchItem, Text, Tooltip } = components;

const cfg = await settings.init("dev.lisekilis.RepluggedTimestamps");

export function Settings(): React.ReactElement {
  return (
    <>
      <SwitchItem
        {...{
          ...util.useSetting(cfg, "prefix", false),
        }}>
        Required Prefix
      </SwitchItem>
      <Category title="Formating">
        <Text.H2 markdown>{"t:hh:mm <t:0:t>"}</Text.H2>
        <Divider />
        <Text.H2 markdown>{"T:hh:mm:ss <t:0:T>"}</Text.H2>
        <Divider />
        <Text.H2 markdown>{"t:hh:mm <t:0:t>"}</Text.H2>
        <Divider />
        <Text.H2 markdown>{"t:hh:mm <t:0:t>"}</Text.H2>
      </Category>
    </>
  );
}
