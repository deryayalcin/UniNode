-- AlterTable
ALTER TABLE "User" ADD COLUMN     "aiVerificationReason" TEXT,
ADD COLUMN     "aiVerificationStatus" TEXT DEFAULT 'pending';
