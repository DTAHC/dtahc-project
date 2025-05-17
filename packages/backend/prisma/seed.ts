import { PrismaClient, Role, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@dtahc.fr' },
    update: {},
    create: {
      email: 'admin@dtahc.fr',
      firstName: 'Admin',
      lastName: 'DTAHC',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log(`Created admin user: ${adminUser.email}`);

  // Create test users with different roles
  const roles = ['COMPTABLE', 'GESTION', 'PRODUCTION', 'USER'];
  
  for (const role of roles) {
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await prisma.user.upsert({
      where: { email: `${role.toLowerCase()}@dtahc.fr` },
      update: {},
      create: {
        email: `${role.toLowerCase()}@dtahc.fr`,
        firstName: role,
        lastName: 'Test',
        password: userPassword,
        role: role as Role,
        status: 'ACTIVE' as UserStatus,
      },
    });
    
    console.log(`Created ${role} user: ${user.email}`);
  }

  // Create a test client
  const testClient = await prisma.client.upsert({
    where: { reference: 'CL-2023-001' },
    update: {},
    create: {
      reference: 'CL-2023-001',
      clientType: 'PARTICULIER',
      createdById: adminUser.id,
      contactInfo: {
        create: {
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean.dupont@example.com',
          phone: '0123456789',
        },
      },
      addresses: {
        create: [
          {
            type: 'POSTAL',
            street: '1 rue du Test',
            postalCode: '75001',
            city: 'Paris',
          },
          {
            type: 'PROJECT',
            street: '1 rue du Projet',
            postalCode: '75001',
            city: 'Paris',
            isProjectAddress: true,
            cadastralReference: '123456',
          },
        ],
      },
    },
  });

  console.log(`Created test client: ${testClient.reference}`);

  // Create a test dossier
  const testDossier = await prisma.dossier.upsert({
    where: { reference: 'DOS-2023-001' },
    update: {},
    create: {
      reference: 'DOS-2023-001',
      title: 'Dossier de test',
      description: 'Dossier de test pour le développement',
      type: 'DP',
      clientId: testClient.id,
      createdById: adminUser.id,
      assignedToId: adminUser.id,
      priority: 'NORMAL',
      surfaceExistant: 100,
      surfaceProjet: 120,
    },
  });

  console.log(`Created test dossier: ${testDossier.reference}`);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });