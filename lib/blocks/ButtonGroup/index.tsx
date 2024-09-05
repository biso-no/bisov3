/* eslint-disable @next/next/no-img-element */
import React from "react";
import { ComponentConfig } from "@measured/puck"
import styles from "./styles.module.css";
import { getClassNameFactory } from "../../get-className-factory";
import { Button } from "@/components/ui/button";
import { Section } from "../../components/Section";
import { redirect } from "next/navigation";

const getClassName = getClassNameFactory("ButtonGroup", styles);

export type ButtonGroupProps = {
  align?: string;
  buttons: { label: string; href: string; variant: "link" | "secondary" | "default" | "destructive" | "outline" | "ghost" }[];
};

export const ButtonGroup: ComponentConfig<ButtonGroupProps> = {
  label: "Button Group",
  fields: {
    buttons: {
      type: "array",
      getItemSummary: (item) => item.label || "Button",
      arrayFields: {
        label: { type: "text" },
        href: { type: "text" },
        variant: {
          type: "radio",
          options: [
            { label: "primary", value: "primary" },
            { label: "secondary", value: "secondary" },
          ],
        },
      },
      defaultItemProps: {
        label: "Button",
        href: "#",
        variant: "default",
      },
    },
    align: {
      type: "radio",
      options: [
        { label: "left", value: "left" },
        { label: "center", value: "center" },
      ],
    },
  },
  defaultProps: {
    buttons: [{ label: "Learn more", href: "#", variant: "default" }],
  },
  render: ({ align, buttons, puck }) => {
    return (
      <Section className={getClassName({ center: align === "center" })}>
        <div className={getClassName("actions")}>
          {buttons.map((button, i) => (
            <Button
              key={i}
              onClick={redirect(button.href)}
              variant={button.variant}
              size="lg"
              tabIndex={puck.isEditing ? -1 : undefined}
            >
              {button.label}1
            </Button>
          ))}
        </div>
      </Section>
    );
  },
};
