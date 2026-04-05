export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-[rgba(var(--green-rgb),0.1)] bg-page py-6">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs text-[#8b949e]">
        <p>
          <span className="text-[var(--green-dim)]">$</span> echo &quot;made with ❤️ in Chile&quot;
        </p>
        <p>
          <span className="text-[var(--green-dim)]">©</span> {year} Nicolás Tapia Moya
        </p>
      </div>
    </footer>
  )
}
