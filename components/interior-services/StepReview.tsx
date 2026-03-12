'use client';

import { staggerContainer, staggerItem } from "./animation";
import { BookingFormData, SERVICES } from "./types";
import { motion } from "framer-motion";
import { FormField, TextareaField } from "./ui/Primitives";
import SummaryRow from "./SummaryRow";

interface StepReviewProps {
    form: BookingFormData;
    onChange: (field: keyof BookingFormData, value: string | string[]) => void;
}
const StepReview = ({ form, onChange }: StepReviewProps) => {
  const selectedService = SERVICES.find((s) => s.id === form.serviceType);
  const handleFileChange = (files: FileList | null) => {
    const names = files ? Array.from(files).map((file) => file.name) : [];
    onChange("inspirationFiles", names);
  };

  const uploadedFiles = Array.isArray(form.inspirationFiles)
    ? form.inspirationFiles
    : [];

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
        <p className="text-[0.68rem] text-stone-600 mt-2">
          The more detail you share, the better we can prepare for your consultation.
        </p>
      </motion.div>

      <motion.div variants={staggerItem}>
        <FormField label="Upload Inspiration Photos or Floor Plan">
          <label
            className="flex cursor-pointer flex-col items-center justify-center rounded-[4px] border border-dashed border-[#BFA07A]/25 bg-white/[0.02] px-5 py-7 text-center transition-colors hover:border-[#BFA07A]/45"
          >
            <span className="mb-2 text-xl text-[#BFA07A]">+</span>
            <span className="text-[0.78rem] text-stone-300">Choose up to a few reference files</span>
            <span className="mt-1 text-[0.68rem] text-stone-500">JPG, PNG, PDF, moodboard screenshots</span>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.pdf"
              multiple
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files)}
            />
          </label>
          {uploadedFiles.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {uploadedFiles.map((fileName) => (
                <span
                  key={fileName}
                  className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[0.68rem] text-stone-300"
                >
                  {fileName}
                </span>
              ))}
            </div>
          )}
        </FormField>
      </motion.div>
 
      {/* Review summary card */}
      <motion.div
        variants={staggerItem}
        className="rounded-[4px] overflow-hidden"
        style={{
          border: "1px solid rgba(191,160,122,0.2)",
          background: "linear-gradient(135deg, rgba(191,160,122,0.05) 0%, rgba(255,255,255,0.01) 100%)",
        }}
      >
        <div className="px-5 py-3.5 border-b border-[#BFA07A]/15 flex items-center justify-between">
          <span className="text-[0.68rem] tracking-[0.18em] uppercase text-[#BFA07A]">
            Booking Summary
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#BFA07A] animate-pulse" />
            <span className="text-[0.6rem] text-[#BFA07A]/70">Ready to submit</span>
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
            label="Uploads"
            value={uploadedFiles.length ? `${uploadedFiles.length} file(s) attached` : "No files attached"}
          />
        </div>
      </motion.div>
 
      {/* Commitment note */}
      <motion.div
        variants={staggerItem}
        className="flex items-start gap-3 p-4 rounded-[3px] bg-white/[0.02] border border-white/[0.05]"
      >
        <span className="text-[#BFA07A] text-sm mt-0.5">✦</span>
        <p className="text-[0.75rem] text-stone-500 leading-relaxed">
          By submitting this form you're not committing to any contract. This is simply a consultation request — our team will reach out within{" "}
          <span className="text-stone-300">24 hours</span> to discuss your project.
        </p>
      </motion.div>
    </motion.div>
  )
}

export default StepReview
