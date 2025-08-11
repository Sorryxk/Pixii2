import './globals.css'
import Link from 'next/link'

export const metadata = { title: 'RaspadinhaX', description: 'Demo full-stack com PIX real (EFI adapter)' }

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="pt-br">
      <body>
        <header className="border-b py-3">
          <div className="container flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl grid place-items-center bg-gradient-to-br from-yellow-400 to-pink-500">★</div>
              <div>
                <div className="font-extrabold tracking-wide">Raspadinha<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">X</span></div>
                <div className="text-xs text-slate-400 -mt-1">demo full‑stack</div>
              </div>
            </Link>
            <nav className="flex items-center gap-4 text-slate-200">
              <Link href="/games">Jogos</Link>
              <Link href="/admin">Admin</Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="border-t py-6 mt-10 text-slate-400">
          <div className="container flex items-center justify-between">
            <p>© {new Date().getFullYear()} RaspadinhaX (Demo). +18 • Jogue com responsabilidade.</p>
            <div className="flex gap-2"><span className="badge">KYC/AML placeholder</span><span className="badge">Geofencing placeholder</span></div>
          </div>
        </footer>
      </body>
    </html>
  )
}
