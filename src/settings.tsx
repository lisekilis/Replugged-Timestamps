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
        <Text.H2 markdown>{"t-hh:mm <t:1692525600:t>"}</Text.H2>
        <Divider />
        <Text.H2 markdown>{"T-hh:mm:ss <t:1692525600:T>"}</Text.H2>
        <Divider />
        <Text.H2 markdown>{"d-hh:mm <t:1692525600:d>"}</Text.H2>
        <Divider />
        <Text.H2 markdown>{"D-hh:mm <t:1692525600:D>"}</Text.H2>
        <Divider />
        <Text.H2 markdown>{"f-hh:mm <t:1692525600:f>"}</Text.H2>
        <Divider />
        <Text.H2 markdown>{"F-hh:mm <t:1692525600:F>"}</Text.H2>
        <Divider />
        <Text.H2 markdown>{"R-hh:mm <t:1692525600:R>"}</Text.H2>
      </Category>
      <Clickable
        onClick={() =>
          window.open("https://discord.com/vanityurl/dotcom/steakpants/flour/flower/index11.html")
        }>
        {<Text.H2>♪(^∇^*)</Text.H2>}
      </Clickable>
    </>
  );
}
