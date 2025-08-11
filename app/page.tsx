import Link from 'next/link'
export default function Home(){
  return (
    <main className="container py-10">
      <section className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h1 className="text-4xl font-extrabold">PIX real integrado <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">via Provider</span></h1>
          <p className="text-slate-300 mt-3">Este template usa Next.js + Prisma e implementa um adapter de PIX (ex.: <b>EFI/Gerencianet</b>) com geração de cobrança imediata, QR/BR Code e webhook para confirmar pagamento.</p>
          <div className="mt-4 flex gap-3">
            <Link href="/games" className="btn">Ver jogos</Link>
            <Link href="/admin" className="btn btn-ghost">Painel admin</Link>
          </div>
          <ul className="mt-4 text-slate-300 text-sm list-disc pl-5 space-y-1">
            <li>API: <code>/api/checkout</code> cria pedido + PIX</li>
            <li>Webhook: <code>/api/webhooks/pix</code> marca pedido como pago</li>
            <li>Troque provider via <code>PIX_PROVIDER</code></li>
          </ul>
        </div>
        <div className="card p-4 text-slate-300 text-sm">
          <p><b>Importante:</b> Produção requer mTLS, chaves e certificados emitidos pelo seu PSP. Configure variáveis de ambiente e URL pública do webhook.</p>
        </div>
      </section>
    </main>
  )
}
