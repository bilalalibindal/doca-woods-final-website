-- AlterTable
ALTER TABLE "public"."Settings" ADD COLUMN     "bannerImages" TEXT[] DEFAULT ARRAY[]::TEXT[];
