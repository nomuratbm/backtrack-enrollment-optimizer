// ─── EmptyState ───────────────────────────────────────────────────────────────
// Reusable table empty-row component (rerender-no-inline-components)
export function EmptyState({ message }: { message: string }) {
  return (
    <tr>
      <td
        colSpan={99}
        style={{
          textAlign: 'center',
          padding: '48px 24px',
          color: '#9e9e9e',
          fontStyle: 'italic',
          fontSize: '0.9rem',
        }}
      >
        {message}
      </td>
    </tr>
  )
}
