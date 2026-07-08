import { useAdmin } from '../context/AdminContext'
import { SectionHeader, StatusBadge, AdminBtn, StatCard } from './DashboardOverview'

function Stars({ rating }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= rating ? '#c8f542' : 'rgba(242,235,220,0.15)', fontSize: 12 }}>★</span>
      ))}
    </span>
  )
}

export default function ReviewsSection() {
  const { reviews, approveReview, deleteReview, stats } = useAdmin()

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
  const pending = reviews.filter(r => r.status === 'pending')
  const approved = reviews.filter(r => r.status === 'approved')

  return (
    <div>
      <SectionHeader title="Reviews" sub={`${reviews.length} reviews · ${stats.pendingReviews} awaiting moderation`} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Reviews" value={reviews.length} icon="★" />
        <StatCard label="Avg. Rating" value={`${avgRating}★`} accent="#c8f542" icon="★" />
        <StatCard label="Pending" value={pending.length} accent="#fbbf24" icon="⏳" />
        <StatCard label="Approved" value={approved.length} accent="#4ade80" icon="✓" />
      </div>

      {/* Pending reviews first */}
      {pending.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#fbbf24', margin: '0 0 16px', fontWeight: 500 }}>Pending Moderation</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {pending.map(r => (
              <div key={r.id} style={{
                background: 'rgba(251,191,36,0.04)', border: '1px solid rgba(251,191,36,0.15)',
                padding: '20px 24px', display: 'flex', gap: 20, alignItems: 'flex-start',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 500, color: '#f2ebdc' }}>{r.customer}</span>
                      <span style={{ fontSize: 10, color: 'rgba(242,235,220,0.3)', margin: '0 8px' }}>on</span>
                      <span style={{ fontSize: 12, color: '#c8f542' }}>{r.product}</span>
                    </div>
                    <Stars rating={r.rating} />
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(242,235,220,0.6)', margin: '0 0 4px', fontWeight: 300, lineHeight: 1.6 }}>{r.text}</p>
                  <p style={{ fontSize: 10, color: 'rgba(242,235,220,0.25)', margin: 0 }}>{r.date}</p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <AdminBtn variant="success" onClick={() => approveReview(r.id)} id={`approve-review-${r.id}`}>Approve</AdminBtn>
                  <AdminBtn variant="danger" onClick={() => deleteReview(r.id)} id={`delete-review-${r.id}`}>Delete</AdminBtn>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All reviews */}
      <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', margin: '0 0 16px', fontWeight: 500 }}>All Reviews</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {reviews.filter(r => r.status !== 'pending').map(r => (
          <div key={r.id} style={{
            background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)',
            padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                <Stars rating={r.rating} />
                <span style={{ fontSize: 11, fontWeight: 500, color: '#f2ebdc' }}>{r.customer}</span>
                <span style={{ fontSize: 10, color: 'rgba(242,235,220,0.3)' }}>on {r.product}</span>
                <StatusBadge status={r.status} />
              </div>
              <p style={{ fontSize: 12, color: 'rgba(242,235,220,0.55)', margin: '0 0 4px', fontWeight: 300, lineHeight: 1.6 }}>{r.text}</p>
              <p style={{ fontSize: 10, color: 'rgba(242,235,220,0.25)', margin: 0 }}>{r.date}</p>
            </div>
            <AdminBtn variant="danger" onClick={() => deleteReview(r.id)} id={`del-review-${r.id}`}>Delete</AdminBtn>
          </div>
        ))}
      </div>
    </div>
  )
}
