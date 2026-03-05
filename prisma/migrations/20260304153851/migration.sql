/*
  Warnings:

  - The `pinyin` column on the `Hanzi` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Hanzi" DROP COLUMN "pinyin",
ADD COLUMN     "pinyin" TEXT[];
