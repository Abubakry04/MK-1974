import { useAdmin } from '../context/AdminContext'
import { SectionHeader, StatusBadge, AdminBtn } from './DashboardOverview'

const ROLE_COLORS = {
  'Super Admin': '#c8f542',
  'Product Manager': '#60a5fa',
  'Operations': '#a78bfa',
  'Customer Support': '#fbbf24',
}

export default function StaffSection() {
  const { staff } = useAdmin()

  return (
    <div>
      <SectionHeader
        title="Staff"
        sub={`${staff.length} team members`}
        action={<AdminBtn id="invite-staff-btn" variant="primary">+ Invite Member</AdminBtn>}
      />

      {/* Staff grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 32 }}>
        {staff.map(s => (
          <div key={s.id} style={{
            background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)',
            padding: '24px 26px', transition: 'border-color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = `${ROLE_COLORS[s.role]}40`}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(242,235,220,0.07)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <div style={{
                width: 44, height: 44, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${ROLE_COLORS[s.role]}15`,
                border: `1px solid ${ROLE_COLORS[s.role]}40`,
                fontSize: 16, fontWeight: 700, fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
                color: ROLE_COLORS[s.role],
              }}>
                {s.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#f2ebdc', margin: '0 0 3px' }}>{s.name}</p>
                <p style={{ fontSize: 10, color: ROLE_COLORS[s.role], margin: 0, letterSpacing: '0.05em' }}>{s.role}</p>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: 'rgba(242,235,220,0.4)', margin: '0 0 4px' }}>{s.email}</p>
              <p style={{ fontSize: 10, color: 'rgba(242,235,220,0.25)', margin: 0 }}>Last login: {s.lastLogin}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <StatusBadge status={s.status} />
              <div style={{ display: 'flex', gap: 8 }}>
                <AdminBtn variant="ghost" id={`edit-staff-${s.id}`}>Edit</AdminBtn>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Roles & Permissions */}
      <div style={{ background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)', padding: 28 }}>
        <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', margin: '0 0 20px', fontWeight: 500 }}>Roles & Permissions</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {[
            { role: 'Super Admin', perms: ['All permissions', 'Manage staff', 'Financial data', 'Delete records'] },
            { role: 'Product Manager', perms: ['Manage products', 'Manage categories', 'Manage inventory', 'View analytics'] },
            { role: 'Operations', perms: ['Manage orders', 'Manage shipping', 'Manage inventory', 'View customers'] },
            { role: 'Customer Support', perms: ['View orders', 'View customers', 'Manage reviews', 'No financial data'] },
          ].map(r => (
            <div key={r.role} style={{ background: `${ROLE_COLORS[r.role]}08`, border: `1px solid ${ROLE_COLORS[r.role]}20`, padding: '16px 18px' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: ROLE_COLORS[r.role], margin: '0 0 10px', letterSpacing: '0.05em' }}>{r.role}</p>
              {r.perms.map(p => (
                <p key={p} style={{ fontSize: 10, color: 'rgba(242,235,220,0.4)', margin: '0 0 4px', fontWeight: 300 }}>· {p}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
