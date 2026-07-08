import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { SectionHeader, AdminBtn } from './DashboardOverview'

export default function CategoriesSection() {
  const { categories, products, createCategory, deleteCategory, apiLoading, apiError } = useAdmin()
  const [newName, setNewName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const handleCreate = async () => {
    if (!newName.trim()) { setError('Category name is required.'); return }
    setSaving(true); setError('')
    try {
      await createCategory({ name: newName.trim() })
      setNewName('')
      setShowForm(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (cat) => {
    if (!confirm(`Delete category "${cat.name}"? Products using this category will be unaffected.`)) return
    try {
      await deleteCategory(cat.id)
    } catch (err) {
      alert(`Failed to delete: ${err.message}`)
    }
  }

  // Count products per category (by matching category id in product.categories array)
  const productCount = (catId) =>
    products.filter(p => (p.categories || []).some(c => c.id === catId)).length

  return (
    <div>
      <SectionHeader
        title="Categories"
        sub={apiLoading ? 'Loading from API…' : `${categories.length} categories`}
        action={<AdminBtn id="add-category-btn" variant="primary" onClick={() => setShowForm(s => !s)}>+ New Category</AdminBtn>}
      />

      {apiError && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', padding: '12px 18px', marginBottom: 24, fontSize: 12, color: '#f87171' }}>
          ⚠ API Error: {apiError}
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <div style={{ background: 'rgba(200,245,66,0.04)', border: '1px solid rgba(200,245,66,0.15)', padding: 24, marginBottom: 24 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#c8f542', margin: '0 0 16px', fontWeight: 500 }}>Create Category</p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.4)', marginBottom: 6, fontWeight: 500 }}>Category Name</label>
              <input
                id="new-category-name"
                placeholder="e.g. Hoodies"
                value={newName}
                onChange={e => { setNewName(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                style={{ width: '100%', background: 'rgba(242,235,220,0.05)', border: '1px solid rgba(242,235,220,0.1)', color: '#f2ebdc', padding: '10px 12px', fontSize: 12, fontFamily: "'Inter', sans-serif", outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <AdminBtn variant="primary" onClick={handleCreate} disabled={saving} id="save-category-btn">
              {saving ? 'Saving…' : 'Create'}
            </AdminBtn>
            <AdminBtn variant="ghost" onClick={() => { setShowForm(false); setError(''); setNewName('') }}>Cancel</AdminBtn>
          </div>
          {error && <p style={{ fontSize: 11, color: '#f87171', margin: '8px 0 0' }}>{error}</p>}
        </div>
      )}

      {/* Categories grid */}
      {apiLoading && categories.length === 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {[1, 2, 3].map(i => <div key={i} style={{ background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)', height: 140 }} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {categories.map(cat => (
            <div key={cat.id} style={{
              background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)',
              padding: '24px 24px', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(200,245,66,0.25)'; e.currentTarget.style.background = 'rgba(200,245,66,0.02)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(242,235,220,0.07)'; e.currentTarget.style.background = 'rgba(242,235,220,0.02)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#f2ebdc', margin: '0 0 3px' }}>{cat.name}</p>
                  <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.25)', margin: 0 }}>ID: {cat.id}</p>
                </div>
                <button
                  id={`delete-cat-${cat.id}`}
                  onClick={() => handleDelete(cat)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(242,235,220,0.2)', fontSize: 16, padding: 4, lineHeight: 1, transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(242,235,220,0.2)'}
                  title="Delete category"
                >×</button>
              </div>
              <div>
                <p style={{ fontSize: 24, fontFamily: "'Playfair Display', serif", fontWeight: 900, fontStyle: 'italic', color: '#c8f542', margin: 0 }}>{productCount(cat.id)}</p>
                <p style={{ fontSize: 9, color: 'rgba(242,235,220,0.3)', margin: 0, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Products</p>
              </div>
            </div>
          ))}

          {categories.length === 0 && !apiLoading && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', color: 'rgba(242,235,220,0.3)', fontSize: 13 }}>
              No categories yet. Create your first one above.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
