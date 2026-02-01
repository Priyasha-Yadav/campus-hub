// src/components/ui/Card.jsx
export default function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card p-6 shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}
