import { Config, Data } from "@measured/puck";
import { ButtonGroup, ButtonGroupProps } from "../blocks/ButtonGroup";
import { Card, CardProps } from "../blocks/Card";
import { Columns, ColumnsProps } from "../blocks/Columns";
import { Hero, HeroProps } from "../blocks/Hero";
import { Heading, HeadingProps } from "../blocks/Heading";
import { Flex, FlexProps } from "../blocks/Flex";
import { Logos, LogosProps } from "../blocks/Logos";
import { Stats, StatsProps } from "../blocks/Stats";
import { Text, TextProps } from "../blocks/Text";
import { VerticalSpace, VerticalSpaceProps } from "../blocks/VerticalSpace";
import { PuckRichText, PuckRichTextProps } from "@tohuhono/puck-rich-text"

import Root, { RootProps } from "./root";

export type { RootProps } from "./root";

export type Props = {
  ButtonGroup: ButtonGroupProps;
  Card: CardProps;
  Columns: ColumnsProps;
  Hero: HeroProps;
  Heading: HeadingProps;
  Flex: FlexProps;
  Logos: LogosProps;
  Stats: StatsProps;
  Text: TextProps;
  VerticalSpace: VerticalSpaceProps;
  PuckRichText: PuckRichTextProps;
};

export type UserConfig = Config<
  Props,
  RootProps,
  "layout" | "typography" | "interactive"
>;

export type UserData = Data<Props, RootProps>;

// We avoid the name config as next gets confused
export const conf: UserConfig = {
  root: {
    defaultProps: {
      title: "My Page",
    },
    render: Root,
  },
  categories: {
    layout: {
      components: ["Columns", "Flex", "VerticalSpace"],
    },
    typography: {
      components: ["Heading", "Text"],
    },
    interactive: {
      title: "Actions",
      components: ["ButtonGroup"],
    },
  },
  components: {
    ButtonGroup,
    Card,
    Columns,
    Hero,
    Heading,
    Flex,
    Logos,
    Stats,
    Text,
    VerticalSpace,
    PuckRichText,
  },
};
