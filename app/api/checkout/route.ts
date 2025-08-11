import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getProvider } from '@/lib/pix/provider'

type CartItem = { id: string; quantity: number }
export async function POST(req: NextRequest){
  const body = await req.json().catch(()=>null)
  if(!body || !Array.isArray(body.items)) return NextResponse.json({error:'Invalid body'}, {status:400})
  const items: CartItem[] = body.items
  const dbGames = await prisma.game.findMany({ where: { id: { in: items.map(i=>i.id) } } })
  let total = 0
  const orderItems: any[] = []
  for(const it of items){
    const g = dbGames.find(x=>x.id===it.id)
    if(!g) continue
    total += g.price * it.quantity
    orderItems.push({ gameId: g.id, quantity: it.quantity, price: g.price })
  }
  if(orderItems.length===0) return NextResponse.json({error:'Empty order'}, {status:400})
  const order = await prisma.order.create({ data:{ total, items:{ create: orderItems } } })

  // Create Pix charge
  const provider = getProvider()
  const charge = await provider.createImmediateCharge({ amount: total, description: `Pedido ${order.id}` })
  const payment = await prisma.payment.create({
    data:{
      orderId: order.id,
      provider: (process.env.PIX_PROVIDER || 'efi').toUpperCase(),
      txid: charge.txid,
      brcode: charge.brcode,
      qrImage: charge.qrImage,
      expiresAt: charge.expiresAt ? new Date(charge.expiresAt) : undefined,
      raw: charge.raw
    }
  })
  return NextResponse.json({ orderId: order.id, total, txid: payment.txid, brcode: payment.brcode, qrImage: payment.qrImage, expiresAt: payment.expiresAt })
}
