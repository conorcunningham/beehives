-- CreateEnum
CREATE TYPE "QueenColour" AS ENUM ('BLUE', 'WHITE', 'YELLOW', 'RED', 'GREEN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Beehive" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "strength" INTEGER NOT NULL,
    "skattekasser" INTEGER NOT NULL,
    "queenColour" "QueenColour" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Beehive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BeekeepingSession" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BeekeepingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BeehiveNote" (
    "id" TEXT NOT NULL,
    "hiveId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BeehiveNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BeehiveKeepers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BeehiveKeepers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Beehive_name_key" ON "Beehive"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BeekeepingSession_date_key" ON "BeekeepingSession"("date");

-- CreateIndex
CREATE UNIQUE INDEX "BeehiveNote_hiveId_sessionId_key" ON "BeehiveNote"("hiveId", "sessionId");

-- CreateIndex
CREATE INDEX "_BeehiveKeepers_B_index" ON "_BeehiveKeepers"("B");

-- AddForeignKey
ALTER TABLE "BeehiveNote" ADD CONSTRAINT "BeehiveNote_hiveId_fkey" FOREIGN KEY ("hiveId") REFERENCES "Beehive"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeehiveNote" ADD CONSTRAINT "BeehiveNote_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "BeekeepingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BeehiveKeepers" ADD CONSTRAINT "_BeehiveKeepers_A_fkey" FOREIGN KEY ("A") REFERENCES "Beehive"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BeehiveKeepers" ADD CONSTRAINT "_BeehiveKeepers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
