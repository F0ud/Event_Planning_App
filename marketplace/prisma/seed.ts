import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create demo host
  const hostPassword = await bcrypt.hash("password123", 12);
  const host = await prisma.user.upsert({
    where: { email: "host@demo.com" },
    update: {},
    create: {
      name: "Maria Garcia",
      email: "host@demo.com",
      passwordHash: hostPassword,
      role: "HOST",
      verified: true,
      bio: "Third-generation ceramic artist from Oaxaca. I love sharing the traditions of black clay pottery with travelers who appreciate handmade art.",
      location: "Oaxaca, Mexico",
    },
  });

  // Create demo guest
  const guestPassword = await bcrypt.hash("password123", 12);
  const guest = await prisma.user.upsert({
    where: { email: "guest@demo.com" },
    update: {},
    create: {
      name: "Alex Johnson",
      email: "guest@demo.com",
      passwordHash: guestPassword,
      role: "GUEST",
      location: "San Francisco, CA",
    },
  });

  // Create second host
  const host2Password = await bcrypt.hash("password123", 12);
  const host2 = await prisma.user.upsert({
    where: { email: "chef@demo.com" },
    update: {},
    create: {
      name: "Yuki Tanaka",
      email: "chef@demo.com",
      passwordHash: host2Password,
      role: "HOST",
      verified: true,
      bio: "Former sushi chef with 15 years of experience. Now teaching the art of Japanese cuisine to food enthusiasts from around the world.",
      location: "Kyoto, Japan",
    },
  });

  // Create experiences
  const experiences = [
    {
      title: "Traditional Black Clay Pottery Workshop",
      slug: "traditional-black-clay-pottery-workshop",
      description:
        "Learn the ancient Zapotec art of barro negro (black clay) pottery in my family workshop. Over 3 hours, you'll shape, carve, and polish your own piece using techniques passed down through generations.\n\nThe workshop includes all materials, a welcome drink of traditional hot chocolate, and you'll take home your finished piece. Groups are kept small to ensure personal attention.\n\nNo prior experience needed \u2014 just bring your curiosity and creativity!",
      category: "ARTISAN" as const,
      price: 75,
      maxGroupSize: 6,
      duration: 180,
      location: "Oaxaca, Mexico",
      featured: true,
      hostId: host.id,
      images: [],
    },
    {
      title: "Oaxacan Mole Cooking Class",
      slug: "oaxacan-mole-cooking-class",
      description:
        "Dive into the heart of Oaxacan cuisine by learning to prepare traditional mole negro \u2014 the queen of moles. We'll visit a local market to select ingredients, then spend the afternoon grinding, toasting, and blending over 30 ingredients into this complex, rich sauce.\n\nYou'll learn the cultural significance behind each ingredient and technique. The class ends with a communal meal of your creation, paired with local mezcal.",
      category: "CULINARY" as const,
      price: 95,
      maxGroupSize: 8,
      duration: 240,
      location: "Oaxaca, Mexico",
      featured: true,
      hostId: host.id,
      images: [],
    },
    {
      title: "Zen Meditation & Tea Ceremony",
      slug: "zen-meditation-tea-ceremony",
      description:
        "Experience the tranquility of a traditional Japanese tea ceremony in an authentic tatami room, followed by guided Zen meditation in our temple garden.\n\nYou'll learn the precise movements and philosophy behind chanoyu (the way of tea), taste premium matcha prepared in the traditional manner, and find your center through 30 minutes of guided zazen meditation.\n\nThis experience is perfect for those seeking mindfulness and cultural depth.",
      category: "WELLNESS" as const,
      price: 60,
      maxGroupSize: 4,
      duration: 120,
      location: "Kyoto, Japan",
      featured: true,
      hostId: host2.id,
      images: [],
    },
    {
      title: "Sushi Making Masterclass",
      slug: "sushi-making-masterclass",
      description:
        "Learn the art of sushi from a former professional sushi chef. This hands-on masterclass covers rice preparation, knife techniques, and how to create nigiri, maki, and hand rolls.\n\nWe'll work with fresh fish from Nishiki Market and you'll leave with the skills to impress at your next dinner party. All ingredients and equipment provided.",
      category: "CULINARY" as const,
      price: 120,
      maxGroupSize: 6,
      duration: 180,
      location: "Kyoto, Japan",
      featured: true,
      hostId: host2.id,
      images: [],
    },
    {
      title: "Mezcal & Agave Farm Tour",
      slug: "mezcal-agave-farm-tour",
      description:
        "Visit a family-owned mezcal distillery in the Oaxacan countryside. Learn the complete process from harvesting agave to distillation, and taste a flight of artisanal mezcals you won't find anywhere else.\n\nIncludes transport from Oaxaca city center, a guided tour of the agave fields, and a tasting of 5 distinct mezcals paired with local snacks.",
      category: "CULTURAL" as const,
      price: 85,
      maxGroupSize: 10,
      duration: 300,
      location: "Oaxaca, Mexico",
      featured: false,
      hostId: host.id,
      images: [],
    },
    {
      title: "Japanese Calligraphy Workshop",
      slug: "japanese-calligraphy-workshop",
      description:
        "Discover the meditative art of Japanese calligraphy (shodo) in a peaceful studio setting. Learn basic brush strokes, character formation, and the philosophy of this centuries-old art form.\n\nYou'll practice writing kanji and create your own piece to take home, beautifully mounted on traditional washi paper.",
      category: "ARTISAN" as const,
      price: 55,
      maxGroupSize: 8,
      duration: 120,
      location: "Kyoto, Japan",
      featured: false,
      hostId: host2.id,
      images: [],
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.upsert({
      where: { slug: exp.slug },
      update: {},
      create: exp,
    });
  }

  console.log("Seed data created successfully!");
  console.log("Demo accounts:");
  console.log("  Host: host@demo.com / password123");
  console.log("  Host: chef@demo.com / password123");
  console.log("  Guest: guest@demo.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
