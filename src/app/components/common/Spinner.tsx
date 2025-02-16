export default function Spinner({ className }: { className?: string }) {
    return (
      <div className={`w-6 h-6 border-4 border-orange-500 border-solid border-t-transparent rounded-full animate-spin ${className}`}></div>
    );
  }