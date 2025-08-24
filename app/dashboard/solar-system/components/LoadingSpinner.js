export default function LoadingSpinner({ size = 50, color = "#0ea5e9" }) {
  return (
    <div className="flex items-center justify-center">
      <div 
        className="loading-spinner"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderColor: `${color}20`,
          borderTopColor: color,
        }}
      />
    </div>
  );
}