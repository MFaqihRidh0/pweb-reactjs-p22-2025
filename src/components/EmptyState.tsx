export default function EmptyState({ title = 'Data kosong', subtitle }: { title?: string, subtitle?: string }) {
  return <div className="empty"><strong>{title}</strong>{subtitle ? <div>{subtitle}</div> : null}</div>
}
