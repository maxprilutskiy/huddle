/*
  Warnings:

  - Added the required column `zilliz_embeddings_id` to the `UserProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "zilliz_embeddings_id" INTEGER NOT NULL;
