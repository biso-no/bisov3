import React from "react";
import { ComponentConfig } from "@measured/puck";
import styles from "./styles.module.css";
import { getClassNameFactory } from "../../get-className-factory";

const getClassName = getClassNameFactory("Hero", styles);

export type HeroProps = {};

export const Hero: ComponentConfig<HeroProps> = {
  fields: {},
  defaultProps: {},
  render: () => {
    return <div className={getClassName()}></div>;
  },
};
