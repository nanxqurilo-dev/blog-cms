"use client";

export type BuilderElement<Props extends Record<string, string> = Record<string, string>> = {
  id?: string;
  type?: string;
  props: Props;
};

export type HeadingWidgetType = BuilderElement<{
  text: string;
  level: "h1" | "h2" | "h3" | "h4";
  color: string;
  align: "left" | "center" | "right";
}>;

export type ImageWidgetType = BuilderElement<{
  src: string;
  width: string;
  borderRadius: string;
}>;

export type TextWidgetType = BuilderElement<{
  content: string;
}>;
