// prisma/seed.ts (update this)
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create default services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Basic Manicure',
        description: 'Basic nail shaping, cuticle care, and regular polish',
        duration: 30,
        price: 25.00
      }
    }),
    prisma.service.create({
      data: {
        name: 'Gel Manicure',
        description: 'Gel polish application that lasts longer',
        duration: 45,
        price: 35.00
      }
    }),
    prisma.service.create({
      data: {
        name: 'Acrylic Full Set',
        description: 'Full set of acrylic nails',
        duration: 90,
        price: 50.00
      }
    }),
    prisma.service.create({
      data: {
        name: 'Pedicure',
        description: 'Foot soak, exfoliation, and polish',
        duration: 45,
        price: 40.00
      }
    }),
    prisma.service.create({
      data: {
        name: 'Nail Art',
        description: 'Custom nail designs',
        duration: 60,
        price: 50.00
      }
    }),
    prisma.service.create({
      data: {
        name: 'Custom Service',
        description: 'Custom nail service with variable duration',
        duration: 30, // Default duration
        price: 0.00
      }
    })
  ])

  console.log('Seeded services:', services)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })