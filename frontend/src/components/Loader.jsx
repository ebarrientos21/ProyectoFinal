export default function Loader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem', gap: '0.5rem' }}>
      {[0, 0.2, 0.4].map((delay, i) => (
        <div key={i} style={{
          width: 10, height: 10, background: 'var(--rojo)', borderRadius: '50%',
          animation: `bounce 0.6s ${delay}s infinite alternate`
        }} />
      ))}
      <style>{`@keyframes bounce { from{transform:translateY(0)} to{transform:translateY(-12px)} }`}</style>
    </div>
  )
}