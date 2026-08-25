-- CreateTable
CREATE TABLE "Cartaz" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "imagem" TEXT NOT NULL,
    "horarioInicio" TEXT NOT NULL,
    "horarioFim" TEXT NOT NULL,
    "duracao" INTEGER NOT NULL,
    "ordem" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cartaz_pkey" PRIMARY KEY ("id")
);
