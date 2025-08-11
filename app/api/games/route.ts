import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export async function GET(){
  const games = await prisma.game.findMany({ orderBy:{ createdAt: 'asc' } })
  return NextResponse.json(games)
}
