"use client";

import React, { createContext, useContext, useReducer } from "react";

export type WidgetData = {
  id?: string;
  type?: string;
  general?: Record<string, unknown>;
  style?: Record<string, unknown>;
  [key: string]: unknown;
};

type EditorDocument = {
  widgets: WidgetData[];
  [key: string]: unknown;
};

type TemplateForm = {
  title: string;
  slug: string;
  description: string;
  slugTouched: boolean;
};

type BuilderTemplate = {
  _id?: string;
  title?: string;
  slug?: string;
  description?: string;
  status?: "draft" | "published";
  draftContent?: {
    widgets?: WidgetData[];
  } | null;
  publishedContent?: {
    widgets?: WidgetData[];
  } | null;
  lastSavedAt?: string | null;
  publishedAt?: string | null;
  [key: string]: unknown;
};

type TemplateUrls = {
  previewPath?: string;
  livePath?: string;
};

type PreviewTemplatePayload = {
  message?: string;
  templateId: string;
  status?: "draft" | "published";
  version?: number;
  content?: {
    widgets?: WidgetData[];
  } | null;
  metadata?: {
    title?: string;
    slug?: string;
    description?: string;
  } | null;
  urls?: TemplateUrls | null;
};

type EditorState = {
  past: EditorDocument[];
  present: EditorDocument;
  future: EditorDocument[];
  mode: "edit" | "preview";
  status: "draft" | "published";
  templateForm: TemplateForm;
  saveState: "idle" | "saving" | "success" | "error";
  saveMessage: string;
  template: BuilderTemplate | null;
  templateUrls: TemplateUrls | null;
};

const initialState: EditorState = {
  past: [],
  present: { widgets: [] },
  future: [],
  mode: "edit",
  status: "draft",
  templateForm: {
    title: "",
    slug: "",
    description: "",
    slugTouched: false,
  },
  saveState: "idle",
  saveMessage: "",
  template: null,
  templateUrls: null,
};

type Action =
  | { type: "UPDATE"; payload: EditorDocument }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "PREVIEW" }
  | { type: "EDIT" }
  | { type: "SAVE_DRAFT" }
  | { type: "PUBLISH" }
  | { type: "SET_TEMPLATE_FIELD"; field: keyof TemplateForm; value: string | boolean }
  | { type: "SAVE_TEMPLATE_START" }
  | {
      type: "SAVE_TEMPLATE_SUCCESS";
      payload: {
        message: string;
        template: BuilderTemplate;
        urls?: TemplateUrls | null;
      };
    }
  | {
      type: "LOAD_TEMPLATE_PREVIEW_SUCCESS";
      payload: PreviewTemplatePayload;
    }
  | {
      type: "LOAD_TEMPLATE_EDIT_SUCCESS";
      payload: PreviewTemplatePayload;
    }
  | { type: "SAVE_TEMPLATE_ERROR"; message: string };

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function reducer(state: EditorState, action: Action): EditorState {
  switch (action.type) {
    case "UPDATE":
      return {
        ...state,
        past: [...state.past, state.present],
        present: action.payload,
        future: [],
      };

    case "UNDO":
      if (!state.past.length) return state;
      const previous = state.past[state.past.length - 1];
      return {
        ...state,
        past: state.past.slice(0, -1),
        future: [state.present, ...state.future],
        present: previous,
      };

    case "REDO":
      if (!state.future.length) return state;
      const next = state.future[0];
      return {
        ...state,
        past: [...state.past, state.present],
        future: state.future.slice(1),
        present: next,
      };

    case "PREVIEW":
      return { ...state, mode: "preview" };

    case "EDIT":
      return { ...state, mode: "edit" };

    case "SAVE_DRAFT":
      localStorage.setItem("draft", JSON.stringify(state.present));
      return { ...state, status: "draft" };

    case "PUBLISH":
      localStorage.setItem("published", JSON.stringify(state.present));
      return { ...state, status: "published" };

    case "SET_TEMPLATE_FIELD": {
      const nextForm = {
        ...state.templateForm,
        [action.field]: action.value,
      } as TemplateForm;

      if (action.field === "title") {
        const nextTitle = String(action.value);
        const currentAutoSlug = slugify(state.templateForm.title);

        if (
          !state.templateForm.slugTouched ||
          state.templateForm.slug === "" ||
          state.templateForm.slug === currentAutoSlug
        ) {
          nextForm.slug = slugify(nextTitle);
          nextForm.slugTouched = false;
        }
      }

      if (action.field === "slug") {
        nextForm.slugTouched = true;
      }

      return {
        ...state,
        templateForm: nextForm,
      };
    }

    case "SAVE_TEMPLATE_START":
      return {
        ...state,
        saveState: "saving",
        saveMessage: "",
      };

    case "SAVE_TEMPLATE_SUCCESS": {
      // const template = action.payload.template;


const template = action.payload?.template;

if (!template) {
  return {
    ...state,
    saveState: "error",
    saveMessage: "Template data missing in response",
  };
}

      const nextWidgets =
        template.draftContent?.widgets ||
        template.publishedContent?.widgets ||
        state.present.widgets;

      localStorage.setItem("draft", JSON.stringify({ widgets: nextWidgets }));

      return {
        ...state,
        present: { widgets: nextWidgets },
        status: template.status || "draft",
        saveState: "success",
        saveMessage: action.payload.message,
        template,
        templateUrls: action.payload.urls || null,
        templateForm: {
          title: template.title || state.templateForm.title,
          slug: template.slug || state.templateForm.slug,
          description: template.description || state.templateForm.description,
          slugTouched: true,
        },
      };
    }

    case "LOAD_TEMPLATE_PREVIEW_SUCCESS": {
      const previewContent = action.payload.content;
      const previewWidgets = previewContent?.widgets || state.present.widgets;
      const nextStatus = action.payload.status || state.status;

      localStorage.setItem("draft", JSON.stringify({ widgets: previewWidgets }));

      return {
        ...state,
        present: { widgets: previewWidgets },
        mode: "preview",
        status: nextStatus,
        saveState: "success",
        saveMessage: action.payload.message || "Preview data fetched",
        template: {
          ...state.template,
          _id: action.payload.templateId,
          title:
            action.payload.metadata?.title ||
            state.template?.title ||
            state.templateForm.title,
          slug:
            action.payload.metadata?.slug ||
            state.template?.slug ||
            state.templateForm.slug,
          description:
            action.payload.metadata?.description ||
            state.template?.description ||
            state.templateForm.description,
          status: nextStatus,
          draftContent:
            nextStatus === "draft"
              ? { widgets: previewWidgets }
              : state.template?.draftContent || null,
          publishedContent:
            nextStatus === "published"
              ? { widgets: previewWidgets }
              : state.template?.publishedContent || null,
        },
        templateUrls: action.payload.urls || state.templateUrls,
        templateForm: {
          title:
            action.payload.metadata?.title ||
            state.templateForm.title,
          slug:
            action.payload.metadata?.slug ||
            state.templateForm.slug,
          description:
            action.payload.metadata?.description ||
            state.templateForm.description,
          slugTouched: true,
        },
      };
    }

    case "LOAD_TEMPLATE_EDIT_SUCCESS": {
      const editContent = action.payload.content;
      const editWidgets = editContent?.widgets || state.present.widgets;
      const nextStatus = action.payload.status || state.status;

      localStorage.setItem("draft", JSON.stringify({ widgets: editWidgets }));

      return {
        ...state,
        present: { widgets: editWidgets },
        past: [],
        future: [],
        mode: "edit",
        status: nextStatus,
        saveState: "success",
        saveMessage: action.payload.message || "Draft template loaded",
        template: {
          ...state.template,
          _id: action.payload.templateId,
          title:
            action.payload.metadata?.title ||
            state.template?.title ||
            state.templateForm.title,
          slug:
            action.payload.metadata?.slug ||
            state.template?.slug ||
            state.templateForm.slug,
          description:
            action.payload.metadata?.description ||
            state.template?.description ||
            state.templateForm.description,
          status: nextStatus,
          draftContent:
            nextStatus === "draft"
              ? { widgets: editWidgets }
              : state.template?.draftContent || null,
          publishedContent:
            nextStatus === "published"
              ? { widgets: editWidgets }
              : state.template?.publishedContent || null,
        },
        templateUrls: action.payload.urls || state.templateUrls,
        templateForm: {
          title: action.payload.metadata?.title || state.templateForm.title,
          slug: action.payload.metadata?.slug || state.templateForm.slug,
          description:
            action.payload.metadata?.description || state.templateForm.description,
          slugTouched: true,
        },
      };
    }

    case "SAVE_TEMPLATE_ERROR":
      return {
        ...state,
        saveState: "error",
        saveMessage: action.message,
      };

    default:
      return state;
  }
}

type EditorContextValue = {
  state: EditorState;
  dispatch: React.Dispatch<Action>;
};

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  );
}

export const useEditor = () => {
  const context = useContext(EditorContext);

  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }

  return context;
};
