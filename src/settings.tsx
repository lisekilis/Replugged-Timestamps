import { components, settings, util } from "replugged";

const { Clickable, Category, Divider, Flex, SwitchItem, SelectItem, Text, Tooltip } = components;
const cfg = await settings.init("dev.lisekilis.RepluggedTimestamps");
//TO DO: make the formating table look cool using flex
export function Settings(): React.ReactElement {
  return (
    <>
      <SwitchItem {...util.useSetting(cfg, "prefix", true)}>Required Prefix</SwitchItem>
      <Category title="Formating">
        <table border={1}>
          <tr>
            <td>
              <Text.H2 markdown>{"t-hh:mm"}</Text.H2>
            </td>
            <td>
              <Text.H2 markdown>{"<t:1692525600:t>"}</Text.H2>
            </td>
          </tr>
          <Divider />
          <tr>
            <td>
              <Text.H2 markdown>{"T-hh:mm:ss"}</Text.H2>
            </td>
            <td>
              <Text.H2 markdown>{"<t:1692525600:T>"}</Text.H2>
            </td>
          </tr>
          <Divider />
          <tr>
            <td>
              <Text.H2 markdown>{"d-hh:mm"}</Text.H2>
            </td>
            <td>
              <Text.H2 markdown>{"<t:1692525600:d>"}</Text.H2>
            </td>
          </tr>
          <Divider />
          <tr>
            <td>
              <Text.H2 markdown>{"D-hh:mm"}</Text.H2>
            </td>
            <td>
              <Text.H2 markdown>{"<t:1692525600:D>"}</Text.H2>
            </td>
          </tr>
          <Divider />
          <tr>
            <td>
              <Text.H2 markdown>{"f-hh:mm"}</Text.H2>
            </td>
            <td>
              <Text.H2 markdown>{"<t:1692525600:f>"}</Text.H2>
            </td>
          </tr>
          <Divider />
          <tr>
            <td>
              <Text.H2 markdown>{"F-hh:mm"}</Text.H2>
            </td>
            <td>
              <Text.H2 markdown>{"<t:1692525600:F>"}</Text.H2>
            </td>
          </tr>
          <Divider />
          <tr>
            <td>
              <Text.H2 markdown>{"R-hh:mm"}</Text.H2>
            </td>
            <td>
              <Text.H2 markdown>{"<t:1692525600:R>"}</Text.H2>
            </td>
          </tr>
        </table>
      </Category>
      <Category title="Date Format">
        <SelectItem //TODO: add a sound for when mdy or ydm is selected
          {...util.useSetting(cfg, "format", "dmy")}
          options={[
            {
              label: "DD/MM/YYYY",
              value: "dmy",
            },
            {
              label: "MM/DD/YYYY",
              value: "mdy",
            },
            {
              label: "YYYY/MM/DD",
              value: "ymd",
            },
            {
              label: "YYYY/DD/MM",
              value: "ydm",
            },
          ]}>
          Date format (separator doesn't matter)
        </SelectItem>
        <SwitchItem {...util.useSetting(cfg, "shortYear", false)}>
          Use short Year (2 digits)
        </SwitchItem>
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
