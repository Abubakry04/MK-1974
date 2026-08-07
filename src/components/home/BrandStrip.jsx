export default function BrandStrip() {
  const stats = [
    { value: 'Premium', label: 'Fabric quality' },
    { value: '30 days', label: 'Easy returns' },
    { value: 'Express', label: 'Doorstep dispatch' },
    { value: 'Nigeria-wide', label: 'Delivery available' },
  ]
  return (
    <div className="bg-surface border-y border-black/[0.07] py-8 px-8 md:px-12">
      <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map(s => (
          <div key={s.value}>
            <p className="text-lg font-bold text-dark">{s.value}</p>
            <p className="text-sm text-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
