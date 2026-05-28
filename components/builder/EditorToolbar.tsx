"use client";

import { useMemo, useState } from "react";
import { useEditor, type WidgetData } from "./EditorProvider";

const BUILDER_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const BUILDER_TEMPLATE_API = `${BUILDER_API_BASE_URL}/api/builder/template`;
const DRAFT_STORAGE_KEY = "builder_template_drafts";
const FALLBACK_DRAFT_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 700'%3E%3Crect width='1200' height='700' fill='%23eff6ff'/%3E%3Crect x='72' y='88' width='1056' height='524' rx='36' fill='%23dbeafe'/%3E%3Ctext x='50%25' y='47%25' text-anchor='middle' fill='%231d4ed8' font-family='Arial, sans-serif' font-size='54' font-weight='700'%3EDraft Template%3C/text%3E%3Ctext x='50%25' y='57%25' text-anchor='middle' fill='%23475569' font-family='Arial, sans-serif' font-size='28'%3EBuilder preview image not available%3C/text%3E%3C/svg%3E";

type CreateTemplateResponse = {
  message?: string;
  template?: {
    _id?: string;
    title?: string;
    slug?: string;
    description?: string;
    status?: "draft" | "published";
    lastSavedAt?: string | null;
    draftContent?: {
      widgets?: WidgetData[];
    } | null;
    publishedContent?: {
      widgets?: WidgetData[];
    } | null;
  };
  urls?: {
    previewPath?: string;
    livePath?: string;
  } | null;
};

type UpdateDraftResponse = {
  message?: string;
  template?: {
    _id?: string;
    title?: string;
    slug?: string;
    description?: string;
    status?: "draft" | "published";
    lastSavedAt?: string | null;
    draftContent?: {
      widgets?: WidgetData[];
    } | null;
    publishedContent?: {
      widgets?: WidgetData[];
    } | null;
  } | null;
  urls?: {
    previewPath?: string;
    livePath?: string;
  } | null;
};

type PreviewTemplateResponse = {
  message?: string;
  templateId?: string;
  status?: "draft" | "published";
  version?: number;
  content?: {
    widgets?: unknown[];
  } | null;
  metadata?: {
    title?: string;
    slug?: string;
    description?: string;
  } | null;
  urls?: {
    previewPath?: string;
    livePath?: string;
  } | null;
};

export default function EditorToolbar({ publishTemplate }: any) {
  const { dispatch, state } = useEditor();
  const { templateForm, saveState, saveMessage, template, templateUrls } = state;
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const previewUrl = useMemo(() => {
    if (!templateUrls?.previewPath) return "";
    return `${BUILDER_API_BASE_URL}${templateUrls.previewPath}`;
  }, [templateUrls?.previewPath]);

  const liveUrl = useMemo(() => {
    if (!templateUrls?.livePath) return "";
    return `${BUILDER_API_BASE_URL}${templateUrls.livePath}`;
  }, [templateUrls?.livePath]);

  function getTemplateThumbnail() {
    const widgets = state.present.widgets;

    for (const widget of widgets) {
      if (
        widget.type === "image" &&
        typeof widget.general?.src === "string" &&
        widget.general.src
      ) {
        return widget.general.src;
      }

      if (
        widget.type === "hero" &&
        typeof widget.general?.bgImage === "string" &&
        widget.general.bgImage
      ) {
        return widget.general.bgImage;
      }
    }

    return FALLBACK_DRAFT_IMAGE;
  }

  function cacheDraftTemplate(templateId: string, savedMessage: string) {
    if (typeof window === "undefined") return;

    const draftEntry = {
      id: templateId,
      title: templateForm.title.trim(),
      desc: templateForm.description.trim(),
      image: getTemplateThumbnail(),
      updated: new Date().toISOString(),
      slug: templateForm.slug.trim(),
      message: savedMessage,
    };

    const existingRaw = localStorage.getItem(DRAFT_STORAGE_KEY);
    const existingDrafts: typeof draftEntry[] = existingRaw
      ? JSON.parse(existingRaw)
      : [];

    const nextDrafts = [
      draftEntry,
      ...existingDrafts.filter((draft) => draft.id !== draftEntry.id),
    ];

    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(nextDrafts));
  }

  async function handlePreviewTemplate() {
    const templateId = template?._id;

    if (!templateId) {
      dispatch({ type: "PREVIEW" });
      return;
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("cms_token") : null;

    if (!token) {
      dispatch({
        type: "SAVE_TEMPLATE_ERROR",
        message: "cms_token not found. Please log in again before loading preview.",
      });
      return;
    }

    setIsPreviewLoading(true);

    try {
      const response = await fetch(
        `${BUILDER_TEMPLATE_API}/${templateId}/preview`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        },
      );

      let result: PreviewTemplateResponse | null = null;

      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok) {
        throw new Error(result?.message || "Failed to fetch preview data.");
      }

      if (!result?.templateId) {
        throw new Error("Preview response was missing template id.");
      }

      dispatch({
        type: "LOAD_TEMPLATE_PREVIEW_SUCCESS",
        payload: {
          message: result.message || "Preview data fetched",
          templateId: result.templateId,
          status: result.status,
          version: result.version,
          content: result.content
            ? {
                widgets: result.content.widgets as never[] | undefined,
              }
            : null,
          metadata: result.metadata || null,
          urls: result.urls || null,
        },
      });
    } catch (error) {
      dispatch({
        type: "SAVE_TEMPLATE_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while loading preview.",
      });
    } finally {
      setIsPreviewLoading(false);
    }
  }

  async function handleCreateTemplate() {
    const title = templateForm.title.trim();
    const slug = templateForm.slug.trim();
    const description = templateForm.description.trim();
    const templateId = template?._id;

    if (!title) {
      dispatch({
        type: "SAVE_TEMPLATE_ERROR",
        message: "Template title is required.",
      });
      return;
    }

    if (!slug) {
      dispatch({
        type: "SAVE_TEMPLATE_ERROR",
        message: "Template slug is required.",
      });
      return;
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("cms_token") : null;

    if (!token) {
      dispatch({
        type: "SAVE_TEMPLATE_ERROR",
        message: `cms_token not found. Please log in again before ${
          templateId ? "updating" : "creating"
        } a template.`,
      });
      return;
    }

    dispatch({ type: "SAVE_TEMPLATE_START" });

    try {
      if (templateId) {
        const response = await fetch(`${BUILDER_TEMPLATE_API}/${templateId}/draft`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            content: {
              widgets: state.present.widgets,
            },
          }),
        });

        let result: UpdateDraftResponse | null = null;

        try {
          result = await response.json();
        } catch {
          result = null;
        }

        if (!response.ok) {
          throw new Error(result?.message || "Failed to update draft template.");
        }

        if (!result?.template?._id) {
          throw new Error("Draft update response was missing template data.");
        }

        cacheDraftTemplate(
          result.template._id,
          result.message || "Draft saved",
        );

        dispatch({
          type: "SAVE_TEMPLATE_SUCCESS",
          payload: {
            message: result.message || "Draft saved",
            template: result.template,
            urls: result.urls || null,
          },
        });

        return;
      }

      const response = await fetch(BUILDER_TEMPLATE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          slug,
          description,
          content: {
            widgets: state.present.widgets,
          },
        }),
      });

      let result: CreateTemplateResponse | null = null;

      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok) {
        throw new Error(result?.message || "Failed to create template.");
      }

      if (!result?.template?._id) {
        throw new Error("Template response was missing template data.");
      }

      cacheDraftTemplate(
        result.template._id,
        result.message || "Builder template created and saved to drafts",
      );

      dispatch({
        type: "SAVE_TEMPLATE_SUCCESS",
        payload: {
          message:
            result.message ||
            "Builder template created and saved to drafts",
          template: result.template,
              // template: data.template, // ✅ THIS WAS MISSING

          urls: result.urls || null,
        },
      });
    } catch (error) {
      dispatch({
        type: "SAVE_TEMPLATE_ERROR",
        message:
          error instanceof Error
            ? error.message
            : `Something went wrong while ${
                templateId ? "updating" : "creating"
              } the template.`,
      });
    }
  }

  return (
    <div className="border-b bg-white p-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="grid flex-1 gap-2 md:grid-cols-3">
          <input
            type="text"
            placeholder="Template title"
            value={templateForm.title}
            onChange={(event) =>
              dispatch({
                type: "SET_TEMPLATE_FIELD",
                field: "title",
                value: event.target.value,
              })
            }
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="template-slug"
            value={templateForm.slug}
            onChange={(event) =>
              dispatch({
                type: "SET_TEMPLATE_FIELD",
                field: "slug",
                value: event.target.value,
              })
            }
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Template description"
            value={templateForm.description}
            onChange={(event) =>
              dispatch({
                type: "SET_TEMPLATE_FIELD",
                field: "description",
                value: event.target.value,
              })
            }
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-md border px-3 py-2 text-sm"
            onClick={() => dispatch({ type: "UNDO" })}
            type="button"
          >
            Undo
          </button>
          <button
            className="rounded-md border px-3 py-2 text-sm"
            onClick={() => dispatch({ type: "REDO" })}
            type="button"
          >
            Redo
          </button>
          <button
            className="rounded-md border px-3 py-2 text-sm"
            onClick={handlePreviewTemplate}
            type="button"
            disabled={isPreviewLoading}
          >
            {isPreviewLoading ? "Loading Preview..." : "Preview"}
          </button>
          <button
            className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-70"
            onClick={handleCreateTemplate}
            type="button"
            disabled={saveState === "saving"}
          >
            {saveState === "saving"
              ? template?._id
                ? "Saving..."
                : "Creating..."
              : template?._id
                ? "Save Draft"
                : "Create Template"}
          </button>
          <button
            className="rounded-md border px-3 py-2 text-sm"

onClick={publishTemplate}

            // onClick={() => dispatch({ type: "PUBLISH" })}
            // type="button"
          >
            Publish
          </button>


  



          {state.mode === "preview" && (
            <button
              className="rounded-md border px-3 py-2 text-sm"
              onClick={() => dispatch({ type: "EDIT" })}
              type="button"
            >
              Back to Edit
            </button>
          )}
        </div>
      </div>

      {(saveMessage || template?._id || templateUrls?.previewPath || templateUrls?.livePath) && (
        <div className="mt-3 flex flex-col gap-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700 md:flex-row md:flex-wrap md:items-center md:gap-4">
          {saveMessage && (
            <span
              className={
                saveState === "error" ? "text-red-600" : "text-green-700"
              }
            >
              {saveMessage}
            </span>
          )}

          {template?._id && <span>Template ID: {template._id}</span>}
          {template?.status && <span>Status: {template.status}</span>}
          {template?.lastSavedAt && (
            <span>
              Last saved: {new Date(template.lastSavedAt).toLocaleString()}
            </span>
          )}
          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Preview URL
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Live URL
            </a>
          )}
        </div>
      )}
    </div>
  );
}
