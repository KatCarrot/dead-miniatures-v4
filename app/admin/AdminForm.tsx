"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { CATEGORY_TABS } from "@/config/categories";
import { supabase } from "@/lib/supabaseClient";
import { ARTWORK_BUCKET } from "@/lib/artworkBucket";

type Status = "idle" | "submitting" | "success" | "error";

const inputStyle: React.CSSProperties = {
  height: 48,
  width: "100%",
  background: "var(--inset)",
  border: "1px solid var(--line)",
  padding: "12px 14px",
  fontFamily: "var(--font-sf)",
  fontSize: 16,
  color: "var(--text)",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: "var(--text-dim)",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: 8,
  display: "block",
};

export default function AdminForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [coverName, setCoverName] = useState("");
  const [extrasCount, setExtrasCount] = useState(0);

  // Uploads one file straight from the browser to Supabase Storage using a
  // signed URL minted by our server, and returns its public URL. This keeps
  // image bytes off our own serverless function — the previous version sent
  // the whole multipart body (including full-size photos) through
  // /api/artworks, which hit the platform's request size limit and failed
  // with "413 Payload Too Large" on anything but tiny images.
  async function uploadDirect(file: File): Promise<string> {
    const signRes = await fetch("/api/artworks/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name }),
    });
    const signed = await signRes.json();
    if (!signRes.ok) {
      throw new Error(signed.error || `Could not get upload URL for ${file.name}`);
    }

    const { error } = await supabase.storage
      .from(ARTWORK_BUCKET)
      .uploadToSignedUrl(signed.path, signed.token, file, {
        contentType: file.type || "image/png",
      });
    if (error) throw new Error(`Upload failed (${file.name}): ${error.message}`);

    return signed.publicUrl as string;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setStatus("submitting");
    setMessage("");

    try {
      const formData = new FormData(formEl);
      const cover = formData.get("cover");
      if (!(cover instanceof File) || cover.size === 0) {
        throw new Error("A cover image is required");
      }
      const extras = formData
        .getAll("extras")
        .filter((f): f is File => f instanceof File && f.size > 0);

      const [image_url, extra_images] = await Promise.all([
        uploadDirect(cover),
        Promise.all(extras.map(uploadDirect)),
      ]);

      const res = await fetch("/api/artworks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          category: formData.get("category"),
          status: formData.get("status"),
          sculptor: formData.get("sculptor"),
          scale: formData.get("scale"),
          game_system: formData.get("game_system"),
          time_hours: formData.get("time_hours"),
          description: formData.get("description"),
          image_url,
          extra_images,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setStatus("success");
      setMessage(`Published! New piece added (#${data.id}).`);
      formEl.reset();
      setCoverName("");
      setExtrasCount(0);
      router.refresh();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Failed to publish");
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 28 }}
    >
      {/* name */}
      <div>
        <label style={labelStyle} htmlFor="name">
          Name *
        </label>
        <input id="name" name="name" required style={inputStyle} />
      </div>

      {/* category + status */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        <div>
          <label style={labelStyle} htmlFor="category">
            Category *
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue=""
            style={{ ...inputStyle, appearance: "none" }}
          >
            <option value="" disabled>
              Select…
            </option>
            {CATEGORY_TABS.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle} htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue="available"
            style={{ ...inputStyle, appearance: "none" }}
          >
            <option value="available">Available</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>

      {/* sculptor + scale */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        <div>
          <label style={labelStyle} htmlFor="sculptor">
            Sculptor
          </label>
          <input id="sculptor" name="sculptor" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle} htmlFor="scale">
            Scale
          </label>
          <input
            id="scale"
            name="scale"
            placeholder="e.g. 75 mm"
            style={inputStyle}
          />
        </div>
      </div>

      {/* game system + time */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        <div>
          <label style={labelStyle} htmlFor="game_system">
            Game system
          </label>
          <input
            id="game_system"
            name="game_system"
            placeholder="e.g. Malifaux"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle} htmlFor="time_hours">
            Time (hours)
          </label>
          <input
            id="time_hours"
            name="time_hours"
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 40"
            style={inputStyle}
          />
        </div>
      </div>

      {/* description */}
      <div>
        <label style={labelStyle} htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          style={{ ...inputStyle, height: "auto", resize: "vertical" }}
        />
      </div>

      {/* cover image */}
      <div>
        <label style={labelStyle}>Cover image *</label>
        <FilePicker
          label={coverName || "Choose main photo…"}
          onPick={(files) => setCoverName(files[0]?.name ?? "")}
        >
          <input
            type="file"
            name="cover"
            accept="image/*"
            required
            style={fileInputHidden}
            onChange={(e) =>
              setCoverName(e.target.files?.[0]?.name ?? "")
            }
          />
        </FilePicker>
      </div>

      {/* extra images */}
      <div>
        <label style={labelStyle}>Additional images</label>
        <FilePicker
          label={
            extrasCount ? `${extrasCount} file(s) selected` : "Choose extra photos…"
          }
          onPick={(files) => setExtrasCount(files.length)}
        >
          <input
            type="file"
            name="extras"
            accept="image/*"
            multiple
            style={fileInputHidden}
            onChange={(e) => setExtrasCount(e.target.files?.length ?? 0)}
          />
        </FilePicker>
      </div>

      {/* submit */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginTop: 8,
        }}
      >
        <button
          type="submit"
          disabled={status === "submitting"}
          style={{
            height: 48,
            padding: "0 32px",
            background: "var(--accent)",
            color: "#0b0a0a",
            border: "none",
            cursor: status === "submitting" ? "default" : "pointer",
            fontFamily: "var(--font-mono)",
            fontWeight: 500,
            fontSize: 16,
            textTransform: "uppercase",
            letterSpacing: "0.03em",
            opacity: status === "submitting" ? 0.6 : 1,
          }}
        >
          {status === "submitting" ? "Publishing…" : "Publish piece"}
        </button>
        {message && (
          <span
            style={{
              fontSize: 14,
              color: status === "error" ? "#ff6b6b" : "var(--accent)",
            }}
          >
            {message}
          </span>
        )}
      </div>
    </form>
  );
}

const fileInputHidden: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  opacity: 0,
  cursor: "pointer",
};

function FilePicker({
  label,
  onPick,
  children,
}: {
  label: string;
  onPick: (files: File[]) => void;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "relative",
        height: 48,
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "var(--inset)",
        border: "1px dashed var(--line)",
        padding: "0 14px",
        color: "var(--text-dim)",
        fontSize: 15,
        overflow: "hidden",
      }}
      onDrop={(e) => {
        e.preventDefault();
        onPick(Array.from(e.dataTransfer.files));
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      <span
        style={{
          flexShrink: 0,
          padding: "6px 12px",
          background: "rgba(255,255,255,0.06)",
          color: "var(--text)",
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        Browse
      </span>
      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}
