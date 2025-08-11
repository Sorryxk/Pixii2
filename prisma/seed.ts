import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main(){
  const count = await prisma.game.count()
  if (count>0){ console.log('Games already seeded'); return }
  await prisma.game.createMany({
    data:[
      { name:'Neon Blast', price:4.99, maxPrize:1000, odds:'1:4.5' },
      { name:'Galactic Luck', price:7.50, maxPrize:5000, odds:'1:6.0' },
      { name:'Pix Spark', price:12.00, maxPrize:10000, odds:'1:8.0' },
      { name:'Turbo Gold', price:18.00, maxPrize:25000, odds:'1:12.0' },
      { name:'Crystal Win', price:5.90, maxPrize:2000, odds:'1:5.0' },
      { name:'Cosmo Jack', price:9.90, maxPrize:8000, odds:'1:7.0' },
    ]
  })
  console.log('Seeded')
}
main().finally(()=>prisma.$disconnect())
