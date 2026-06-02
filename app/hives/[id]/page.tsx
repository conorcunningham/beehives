import { prisma } from "@/lib/prisma"

export default async function BeehivePage({ params }: {params: Promise <{id: string }> }) {
    const { id } = await params;
    const beeHive = await prisma.beehive.findUnique({
        where: { id },
    })
        return (
      <ul>
          <li key={beeHive?.id}>{beeHive?.name} — {beeHive?.queenColour}</li>
      </ul>
    )
}




