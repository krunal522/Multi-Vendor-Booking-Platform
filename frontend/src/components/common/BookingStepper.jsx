import React from "react";
import { FiCheck, FiClock, FiCalendar, FiTool, FiCheckCircle, FiXCircle } from "react-icons/fi";

const STEPS = [
  { key: "pending", label: "Requested", icon: FiClock, desc: "Awaiting vendor confirmation" },
  { key: "confirmed", label: "Confirmed", icon: FiCalendar, desc: "Vendor accepted appointment" },
  { key: "in_progress", label: "In Progress", icon: FiTool, desc: "Service actively in progress" },
  { key: "completed", label: "Completed", icon: FiCheckCircle, desc: "Service successfully delivered" },
];

export default function BookingStepper({ status, cancelReason }) {
  if (status === "cancelled" || status === "rejected") {
    return (
      <div className="stepper-cancelled-banner">
        <FiXCircle size={18} />
        <div>
          <strong>Booking {status === "cancelled" ? "Cancelled" : "Rejected"}</strong>
          {cancelReason && <span style={{ opacity: 0.85, marginLeft: 8 }}>— {cancelReason}</span>}
        </div>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === status);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;
  const progressPercent = activeIndex === 0 ? 0 : Math.round((activeIndex / (STEPS.length - 1)) * 100);

  return (
    <div className="booking-stepper-wrapper">
      <div className="booking-stepper">
        {/* Animated Connecting Line */}
        <div className="stepper-progress-track">
          <div
            className="stepper-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Steps */}
        {STEPS.map((step, idx) => {
          const isDone = activeIndex > idx;
          const isActive = activeIndex === idx;
          const StepIcon = step.icon;

          return (
            <div
              key={step.key}
              className={`stepper-step ${isDone ? "completed" : ""} ${isActive ? "active" : ""}`}
              title={step.desc}
            >
              <div className="stepper-circle">
                {isDone ? (
                  <FiCheck size={16} strokeWidth={3} />
                ) : (
                  <StepIcon size={14} />
                )}
                {isActive && <span className="stepper-ping" />}
              </div>
              <span className="stepper-label">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
