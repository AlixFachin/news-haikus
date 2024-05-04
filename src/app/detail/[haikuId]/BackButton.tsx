"use client";

export default function BackButton() {
  return (
    <div
      className="cursor-pointer rounded-md bg-orange-300 p-2 text-sm shadow-sm dark:bg-blue-950"
      onClick={() => window.history.back()}
    >
      Back
    </div>
  );
}
