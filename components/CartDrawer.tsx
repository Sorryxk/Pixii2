'use client'
import { useState } from 'react'
import { useCart } from '@/store/cart'

async function checkout(items: {id:string; quantity:number}[]){
  const res = await fetch('/api/checkout', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ items }) })
  if(!res.ok) throw new Error('Falha no checkout')
  return res.json()
}

export default function CartDrawer(){
  const [open, setOpen] = useState(false)
  const { items, inc, dec, clear } = useCart()
  const total = items.reduce((a,b)=>a + b.price*b.quantity, 0)
  const [loading, setLoading] = useState(false)
  const [pix, setPix] = useState<{orderId:string; brcode:string; qrImage?:string; expiresAt?:string} | null>(null)

  const onCheckout = async () => {
    setLoading(true)
    try{
      const payload = items.map(i=>({ id:i.id, quantity:i.quantity }))
      const data = await checkout(payload)
      setPix({ orderId: data.orderId, brcode: data.brcode, qrImage: data.qrImage, expiresAt: data.expiresAt })
    }finally{ setLoading(false) }
  }

  return (
    <>
      <button className="relative" onClick={()=> setOpen(true)}>
        <span className="text-2xl">🛒</span>
        {items.length>0 && <span className="absolute -top-2 -right-2 text-xs bg-rose-500 text-white rounded-full px-2 border-2 border-black">{items.reduce((a,b)=>a+b.quantity,0)}</span>}
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={()=> setOpen(false)}>
          <aside className="absolute right-0 top-0 h-full w-[420px] max-w-[92vw] bg-[#0b0c1a] border-l border-[#23264a] p-4 flex flex-col gap-3" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between"><h3 className="font-bold text-lg">Seu carrinho</h3><button onClick={()=> setOpen(false)}>✕</button></div>
            <div className="flex-1 overflow-auto flex flex-col gap-2">
              {items.length===0 ? <div className="text-slate-400 text-center py-16">Carrinho vazio</div> :
              items.map(i=> (
                <div key={i.id} className="grid grid-cols-[48px,1fr,auto] gap-3 items-center card p-2">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#202447] to-[#161a39]" />
                  <div>
                    <div className="font-bold">{i.name}</div>
                    <div className="text-xs text-slate-400">R$ {i.price.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 border rounded-lg" onClick={()=> dec(i.id)}>-</button>
                    <b>{i.quantity}</b>
                    <button className="px-2 py-1 border rounded-lg" onClick={()=> inc(i.id)}>+</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto space-y-2">
              <div className="flex items-center justify-between">
                <span>Total</span><b>R$ {total.toFixed(2)}</b>
              </div>
              {!pix ? (
                <button className="btn w-full disabled:opacity-50" disabled={items.length===0 || loading} onClick={onCheckout}>
                  {loading ? 'Processando…' : 'Gerar PIX'}
                </button>
              ) : (
                <div className="card p-3">
                  <div className="text-sm text-slate-300 mb-2">Pague com PIX (expira {pix.expiresAt ? new Date(pix.expiresAt).toLocaleString('pt-BR') : 'em 1h'})</div>
                  {pix.qrImage ? <img src={pix.qrImage} alt="QR PIX" className="rounded-lg w-full" /> : <textarea className="w-full text-xs h-24" readOnly value={pix.brcode} />}
                  <a className="btn btn-ghost w-full mt-2" href={`pix:${encodeURIComponent(pix.brcode)}`}>Abrir no app do banco</a>
                  <div className="text-xs text-slate-400 mt-2">Após o pagamento, o status muda para <b>PAID</b> via webhook.</div>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
