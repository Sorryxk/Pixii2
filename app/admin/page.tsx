import { prisma } from '@/lib/prisma'

export default async function Admin(){
  const [games, orders] = await Promise.all([
    prisma.game.findMany({ orderBy:{ createdAt: 'desc' } }),
    prisma.order.findMany({ orderBy:{ createdAt: 'desc' }, include:{ items:true, payment:true } })
  ])
  return (
    <main className="container py-8 space-y-6">
      <section className="card p-4">
        <h3 className="font-bold text-lg mb-2">Jogos (catálogo)</h3>
        <div className="grid md:grid-cols-3 gap-3">
          {games.map(g=> (
            <div key={g.id} className="card p-3">
              <div className="flex items-center justify-between">
                <b>{g.name}</b><span className="text-yellow-300 font-extrabold">R$ {g.price.toFixed(2)}</span>
              </div>
              <div className="text-sm text-slate-300 mt-1">Prêmio máx: R$ {g.maxPrize.toLocaleString('pt-BR')} • Odds: {g.odds}</div>
              <div className="text-xs text-slate-400 mt-2">Criado em {new Date(g.createdAt).toLocaleString('pt-BR')}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="card p-4">
        <h3 className="font-bold text-lg mb-2">Pedidos</h3>
        <div className="space-y-2">
          {orders.map(o=> (
            <div key={o.id} className="card p-3">
              <div className="flex items-center justify-between">
                <b>Pedido {o.id}</b>
                <span>Total: R$ {o.total.toFixed(2)} — <b className={o.status==='PAID' ? 'text-green-400' : 'text-amber-300'}>{o.status}</b></span>
              </div>
              <ul className="mt-2 text-sm text-slate-300 list-disc pl-5">
                {o.items.map(i=> <li key={i.id}>{i.quantity}x {i.price.toFixed(2)} (game {i.gameId})</li>)}
              </ul>
              {o.payment && <div className="text-xs text-slate-400 mt-1">TXID: {o.payment.txid} • expira: {o.payment.expiresAt ? new Date(o.payment.expiresAt).toLocaleString('pt-BR') : '-'}</div>}
              <div className="text-xs text-slate-500 mt-1">Criado em {new Date(o.createdAt).toLocaleString('pt-BR')}</div>
            </div>
          ))}
          {orders.length===0 && <div className="text-slate-400">Nenhum pedido ainda.</div>}
        </div>
      </section>
      <section className="text-xs text-slate-400">
        <p><b>Aviso:</b> Produção exige autenticação, RBAC, logs, KYC/AML, geofencing e antifraude. Verifique licenças e regulamentação antes de operar.</p>
      </section>
    </main>
  )
}
