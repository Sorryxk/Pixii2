'use client'
import { useCart } from '@/store/cart'
type Props = { game: { id:string; name:string; price:number; maxPrize:number; odds:string } }
export default function GameCard({ game }: Props){
  const add = useCart(s=>s.add)
  return (
    <div className="card p-3 flex flex-col gap-3">
      <div className="h-40 grid place-items-center rounded-xl bg-gradient-to-br from-[#202447] to-[#161a39] border border-[#2b2f55]">
        <div className="w-10/12 h-3/5 rounded-xl grid place-items-center text-[#b7c2ff] font-extrabold text-xl border-dashed border border-[#3a3f74]">RASPADINHA</div>
      </div>
      <div className="flex items-center justify-between">
        <b>{game.name}</b>
        <span className="text-yellow-300 font-extrabold">R$ {game.price.toFixed(2)}</span>
      </div>
      <div className="flex items-center justify-between text-slate-400 text-sm">
        <span>Prêmio máx: R$ {game.maxPrize.toLocaleString('pt-BR')}</span>
        <span>Odds: {game.odds}</span>
      </div>
      <button className="btn mt-1" onClick={()=> add({ id:game.id, name:game.name, price:game.price })}>Adicionar</button>
    </div>
  )
}
