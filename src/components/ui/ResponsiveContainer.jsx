export default function ResponsiveContainer({ children, className = '' }) {
  return (
    <div className={`
      container-responsive
      ${className}
    `}>
      {children}
    </div>
  )
}
