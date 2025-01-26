/*
  Warnings:

  - Added the required column `type` to the `Promotion` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PromotionType" AS ENUM ('PERCENTAGE', 'FIXED', 'WEIGHTED');

-- AlterTable
ALTER TABLE "Promotion" ADD COLUMN     "discount" DOUBLE PRECISION,
ADD COLUMN     "slabs" JSONB,
ADD COLUMN     "type" "PromotionType" NOT NULL;
