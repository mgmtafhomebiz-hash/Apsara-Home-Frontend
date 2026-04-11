'use client';

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { staggerContainer, staggerItem } from "./animation";
import { BookingFormData, SERVICES } from "./types";
import { motion } from "framer-motion";
import { FormField, InputField, TextareaField } from "./ui/Primitives";
import SummaryRow from "./SummaryRow";

interface StepReviewProps {
    form: BookingFormData;
    onChange: (field: keyof BookingFormData, value: string | string[]) => void;
}

const isValidUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const isImageReference = (value: string) =>
  /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(value) ||
  value.includes("res.cloudinary.com");

const StepReview = ({ form, onChange }: StepReviewProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [referenceLink, setReferenceLink] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const selectedService = SERVICES.find((s) => s.id === form.serviceType);

  const uploadedFiles = Array.isArray(form.inspirationFiles)
    ? form.inspirationFiles
    : [];

  const updateReferences = (nextItems: string[]) => {
    onChange("inspirationFiles", Array.from(new Set(nextItems.filter(Boolean))));
  };

  const uploadFiles = async (files: File[]) => {
    if (!files.length) return;

    setIsUploading(true);
    setUploadError("");

    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const payload = new FormData();
        const isPdf = file.type === "application/pdf";

        payload.append("file", file);
        payload.append("folder", "web-content");
        payload.append("asset_type", isPdf ? "pdf" : "image");

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: payload,
        });

        const result = await response.json();

        if (!response.ok || !result?.url) {
          throw new Error(result?.error || "Upload failed. Please try again.");
        }

        uploadedUrls.push(result.url);
      }

      updateReferences([...uploadedFiles, ...uploadedUrls]);
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : "Upload failed. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    await uploadFiles(files);
    event.target.value = "";
  };

  const handleAddLink = () => {
    const trimmedLink = referenceLink.trim();

    if (!trimmedLink) return;

    if (!isValidUrl(trimmedLink)) {
      setUploadError("Please enter a valid image or inspiration link.");
      return;
    }

    updateReferences([...uploadedFiles, trimmedLink]);
    setReferenceLink("");
    setUploadError("");
  };

  const handleRemoveReference = (target: string) => {
    updateReferences(uploadedFiles.filter((item) => item !== target));
  };

  const handleDrop = async (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const files = Array.from(event.dataTransfer.files ?? []);
    await uploadFiles(files);
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-7"
    >
      {/* Notes / message textarea */}
      <motion.div variants={staggerItem}>
        <FormField label="Project Notes & Message">
          <TextareaField
            placeholder="Tell us about your space, your style influences, what you hope to feel when you walk through the door, any inspiration images, specific requirements, or anything else you'd like us to know..."
            value={form.notes}
            onChange={(v) => onChange("notes", v)}
            rows={5}
          />
        </FormField>
        <p className="text-[0.68rem] text-slate-400 mt-2">
          The more detail you share, the better we can prepare for your consultation.
        </p>
      </motion.div>

      <motion.div variants={staggerItem}>
        <FormField label="Inspiration References (Optional)">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <InputField
                placeholder="Paste Pinterest, Google Drive, Instagram, or mood board link"
                value={referenceLink}
                onChange={setReferenceLink}
              />
            </div>
            <button
              type="button"
              onClick={handleAddLink}
              className="rounded-[4px] px-4 py-3 text-[0.78rem] font-medium text-white transition"
              style={{ background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)" }}
            >
              Add Link
            </button>
          </div>

          <label
            className="flex cursor-pointer flex-col items-center justify-center rounded-[4px] px-5 py-7 text-center transition-colors"
            style={{
              border: isDragging
                ? "1.5px dashed rgba(79,70,229,0.7)"
                : "1.5px dashed rgba(99,102,241,0.3)",
              background: isDragging
                ? "rgba(99,102,241,0.08)"
                : "rgba(99,102,241,0.02)",
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <span className="mb-2 text-xl text-indigo-500">+</span>
            <span className="text-[0.78rem] text-slate-600">
              Drag and drop an image/file here, or click to browse
            </span>
            <span className="mt-1 text-[0.68rem] text-slate-400">
              Images and PDFs are supported. Links are optional too.
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.gif,.pdf"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-[0.68rem] text-slate-400">
              Add either a link, an uploaded image, or both.
            </p>
            {isUploading && (
              <span className="text-[0.68rem] text-indigo-500">Uploading...</span>
            )}
          </div>
          {uploadError && (
            <p className="mt-2 text-[0.68rem] text-rose-500">{uploadError}</p>
          )}
          {uploadedFiles.length > 0 && (
            <div className="mt-4 grid gap-2">
              {uploadedFiles.map((reference) => (
                <div
                  key={reference}
                  className="flex items-center justify-between gap-3 rounded-[4px] border border-indigo-100 bg-indigo-50/70 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-[0.7rem] font-medium uppercase tracking-[0.08em] text-indigo-500">
                      {isImageReference(reference) ? "Image/File" : "Link"}
                    </p>
                    <a
                      href={reference}
                      target="_blank"
                      rel="noreferrer"
                      className="block truncate text-[0.72rem] text-slate-600 hover:text-indigo-600 hover:underline"
                    >
                      {reference}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveReference(reference)}
                    className="shrink-0 text-[0.68rem] font-medium text-rose-500 transition hover:text-rose-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </FormField>
      </motion.div>

      {/* Review summary card */}
      <motion.div
        variants={staggerItem}
        className="rounded-[6px] overflow-hidden"
        style={{
          border: "1px solid rgba(99,102,241,0.15)",
          background: "linear-gradient(135deg, rgba(99,102,241,0.04) 0%, rgba(255,255,255,0.9) 100%)",
        }}
      >
        <div
          className="px-5 py-3.5 border-b flex items-center justify-between"
          style={{ borderColor: "rgba(99,102,241,0.1)" }}
        >
          <span className="text-[0.68rem] tracking-[0.18em] uppercase text-indigo-600">
            Booking Summary
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[0.6rem] text-indigo-400">Ready to submit</span>
          </div>
        </div>

        <div className="px-5">
          <SummaryRow
            label="Service"
            value={selectedService?.title ?? form.serviceType}
          />
          <SummaryRow label="Project Type" value={form.projectType} />
          <SummaryRow label="Property Type" value={form.propertyType} />
          <SummaryRow label="Project Scope" value={form.projectScope} />
          <SummaryRow label="Budget" value={form.budget} />
          <SummaryRow label="Style Direction" value={form.stylePreference} />
          <SummaryRow
            label="Date"
            value={
              form.preferredDate
                ? new Date(form.preferredDate + "T00:00:00").toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""
            }
          />
          <SummaryRow label="Time" value={form.preferredTime} />
          <SummaryRow label="Timeline" value={form.targetTimeline} />
          <SummaryRow
            label="Contact"
            value={
              [form.firstName, form.lastName].filter(Boolean).join(" ") ||
              form.email
            }
          />
          <SummaryRow label="Email" value={form.email} />
          <SummaryRow
            label="References"
            value={uploadedFiles.length ? `${uploadedFiles.length} item(s) attached` : "No references attached"}
          />
        </div>
      </motion.div>

      {/* Commitment note */}
      <motion.div
        variants={staggerItem}
        className="flex items-start gap-3 p-4 rounded-[4px]"
        style={{
          background: "rgba(99,102,241,0.03)",
          border: "1px solid rgba(99,102,241,0.1)",
        }}
      >
        <span className="text-indigo-500 text-sm mt-0.5">✦</span>
        <p className="text-[0.75rem] text-slate-500 leading-relaxed">
          By submitting this form you're not committing to any contract. This is simply a consultation request — our team will reach out within{" "}
          <span className="text-slate-700">24 hours</span> to discuss your project.
        </p>
      </motion.div>
    </motion.div>
  )
}

export default StepReview
