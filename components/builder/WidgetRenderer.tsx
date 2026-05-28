"use client";

import TextWidget from "./widgets/TextWidget";
import ButtonWidget from "./widgets/ButtonWidget";
import ImageWidget from "./widgets/ImageWidget";
import ParagraphWidget from "./widgets/ParagraphWidget";
import SeparatorWidget from "./widgets/SeparatorWidget";
import HeroWidget from "./widgets/HeroWidget";
import TestimonialWidget from "./widgets/TestimonialWidget";
import VideoWidget from "./widgets/VideoWidget";
import HeadingWidget from "./widgets/HeadingWidget";
import ImageCarouselWidget from "./widgets/ImageCarouselWidget";
import IconBoxWidget from "./widgets/IconBoxWidget";
import AccordionWidget from "./widgets/AccordionWidget";
import InnerSectionWidget from "./widgets/InnerSectionWidget";

export default function WidgetRenderer({ widget }: any) {
  if (!widget || !widget.type) return null;

  switch (widget.type) {
    case "text":
      return <TextWidget widget={widget} />;

    case "button":
      return <ButtonWidget widget={widget} />;

    case "image":
      return <ImageWidget widget={widget} />;

    case "paragraph":
      return <ParagraphWidget widget={widget} />;

    case "separator":
      return <SeparatorWidget widget={widget} />;

    case "hero":
      return <HeroWidget widget={widget} />;

    case "testimonial":
      return <TestimonialWidget widget={widget} />;

    case "video":
      return <VideoWidget widget={widget} />;

    case "heading":
      return <HeadingWidget widget={widget} />;

    case "image-carousel":
      return <ImageCarouselWidget widget={widget} />;

    case "icon-box":
      return <IconBoxWidget widget={widget} />;

    case "accordion":
      return <AccordionWidget widget={widget} />;

    case "inner-section":
      return <InnerSectionWidget widget={widget} />;

    default:
      return null;
  }
}
