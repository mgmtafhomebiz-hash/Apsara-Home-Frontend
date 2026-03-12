'use client';

import { staggerContainer, staggerItem } from "./animation";
import { BookingFormData, TIME_SLOTS } from "./types";
import { motion } from "framer-motion";
import { FormField, SelectField } from "./ui/Primitives";
import { useState } from "react";

interface StepScheduleProps {
  form: BookingFormData;
  onChange: (field: keyof BookingFormData, value: string | string[]) => void;
}
 
const FLEXIBILITY_OPTIONS = [
  { value: "exact", label: "This exact date only" },
  { value: "week", label: "Within the same week" },
  { value: "flexible", label: "Flexible (any time)" },
];

const TIMELINE_OPTIONS = [
  { value: "asap", label: "As soon as possible" },
  { value: "one-month", label: "Within 1 month" },
  { value: "three-months", label: "Within 3 months" },
  { value: "six-months", label: "Within 6 months" },
  { value: "planning", label: "Still planning / exploring" },
];

const today = new Date().toISOString().split("T")[0];


const StepSchedule = ({ form, onChange }: StepScheduleProps) => {
  const [dateFocused, setDateFocused] = useState(false);
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-7"
    >
      {/* Date & time row */}
      <motion.div variants={staggerItem} className="grid grid-cols-2 gap-4">
        {/* Preferred date */}
        <FormField label="Preferred Date" required>
          <div className="relative">
            <input
              type="date"
              min={today}
              value={form.preferredDate}
              onChange={(e) => onChange("preferredDate", e.target.value)}
              onFocus={() => setDateFocused(true)}
              onBlur={() => setDateFocused(false)}
              className="w-full bg-white/[0.03] text-stone-300 text-sm px-4 py-3 rounded-[3px] outline-none transition-all duration-300"
              style={{
                border: dateFocused
                  ? "1px solid rgba(191,160,122,0.7)"
                  : "1px solid rgba(255,255,255,0.08)",
                boxShadow: dateFocused ? "0 0 0 3px rgba(191,160,122,0.07)" : "none",
                colorScheme: "dark",
              }}
            />
          </div>
        </FormField>
 
        {/* Preferred time */}
        <FormField label="Preferred Time" required>
          <SelectField
            options={TIME_SLOTS.map((t) => ({ value: t, label: t }))}
            placeholder="Select slot"
            value={form.preferredTime}
            onChange={(v) => onChange("preferredTime", v)}
          />
        </FormField>
      </motion.div>
 
      {/* Flexibility */}
      <motion.div variants={staggerItem}>
        <FormField label="Schedule Flexibility">
          <SelectField
            options={FLEXIBILITY_OPTIONS}
            placeholder="How flexible are you?"
            value={form.flexibility}
            onChange={(v) => onChange("flexibility", v)}
          />
        </FormField>
      </motion.div>

      <motion.div variants={staggerItem}>
        <FormField label="Ideal Project Timeline">
          <SelectField
            options={TIMELINE_OPTIONS}
            placeholder="When would you like to begin?"
            value={form.targetTimeline}
            onChange={(v) => onChange("targetTimeline", v)}
          />
        </FormField>
      </motion.div>
 
      {/* Time slot visual picker */}
      <motion.div variants={staggerItem}>
        <label className="text-[0.68rem] tracking-[0.14em] uppercase text-stone-400 font-medium block mb-3">
          Quick Time Select
        </label>
        <div className="flex flex-wrap gap-2">
          {TIME_SLOTS.map((slot) => {
            const isSelected = form.preferredTime === slot;
            return (
              <motion.button
                key={slot}
                type="button"
                onClick={() => onChange("preferredTime", slot)}
                className="text-[0.7rem] tracking-wide px-3.5 py-2 rounded-[3px] transition-all duration-250"
                style={{
                  border: isSelected
                    ? "1px solid rgba(191,160,122,0.7)"
                    : "1px solid rgba(255,255,255,0.07)",
                  background: isSelected ? "rgba(191,160,122,0.12)" : "rgba(255,255,255,0.02)",
                  color: isSelected ? "#BFA07A" : "#78716c",
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                {slot}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
 
      {/* Info note */}
      <motion.div
        variants={staggerItem}
        className="flex items-start gap-3 p-4 rounded-[3px] bg-[#BFA07A]/05 border border-[#BFA07A]/10"
      >
        <span className="text-[#BFA07A] text-sm mt-0.5 flex-shrink-0">ℹ</span>
        <p className="text-[0.75rem] text-stone-500 leading-relaxed">
          Our team will confirm your appointment within 24 hours and may suggest an alternative slot if your preferred time is unavailable.
        </p>
      </motion.div>
    </motion.div>
  )
}

export default StepSchedule
