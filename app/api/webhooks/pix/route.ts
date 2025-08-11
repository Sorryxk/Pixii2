import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest){
  const body = await req.json().catch(()=>null)
  // Estrutura comum de webhooks de PSPs Pix: { pix: [{ txid, endToEndId, valor, horario, ... }] }
  if(!body || !Array.isArray(body.pix)) return NextResponse.json({ ok: true })
  for(const p of body.pix){
    if(!p.txid) continue
    const pay = await prisma.payment.findFirst({ where:{ txid: p.txid } })
    if(!pay) continue
    await prisma.payment.update({ where:{ id: pay.id }, data:{ status:'PAID', raw: { ...pay.raw, webhook: body } } })
    await prisma.order.update({ where:{ id: pay.orderId }, data:{ status: 'PAID' } })
  }
  return NextResponse.json({ ok: true })
}
