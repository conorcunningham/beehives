import { prisma } from "@/lib/prisma"

export default async function BeehivesPage() {
  const beeHives = await prisma.beehive.findMany();

    return (
      <ul>
        {beeHives.map((hive) => (
          <li key={hive.id}>{hive.name} — {hive.queenColour}</li>
        ))}
      </ul>
    );
  }
