-- CreateEnum
CREATE TYPE "CollegeType" AS ENUM ('GOVERNMENT', 'PRIVATE', 'AUTONOMOUS');

-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('JEE_MAIN', 'MP_DTE');

-- CreateEnum
CREATE TYPE "BranchCode" AS ENUM ('CSE', 'AIML', 'IT', 'EC', 'ME', 'CE');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('GENERAL', 'OBC', 'SC', 'ST', 'EWS');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('OFFICIAL_COUNSELLING', 'OFFICIAL_COLLEGE', 'REGULATORY', 'RANKING', 'DEMO');

-- CreateEnum
CREATE TYPE "ConfidenceLevel" AS ENUM ('VERIFIED', 'PARTIALLY_VERIFIED', 'DEMO');

-- CreateTable
CREATE TABLE "College" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'Madhya Pradesh',
    "type" "CollegeType" NOT NULL,
    "affiliation" TEXT,
    "approvalStatus" TEXT,
    "officialWebsite" TEXT,
    "overview" TEXT,
    "hostelAvailable" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "College_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "branchCode" "BranchCode" NOT NULL,
    "branchName" TEXT NOT NULL,
    "degree" TEXT NOT NULL DEFAULT 'B.Tech',
    "durationYears" INTEGER NOT NULL DEFAULT 4,
    "annualFee" INTEGER,
    "examAccepted" "ExamType" NOT NULL,
    "averagePackage" DOUBLE PRECISION,
    "highestPackage" DOUBLE PRECISION,
    "placementYear" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "sourceType" "SourceType" NOT NULL,
    "academicYear" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "confidence" "ConfidenceLevel" NOT NULL DEFAULT 'DEMO',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DataSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cutoff" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "sourceId" TEXT,
    "counsellingAuthority" TEXT NOT NULL DEFAULT 'DTE MP',
    "year" INTEGER NOT NULL,
    "round" INTEGER NOT NULL,
    "category" "Category" NOT NULL,
    "openingRank" INTEGER,
    "closingRank" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cutoff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "College_slug_key" ON "College"("slug");

-- CreateIndex
CREATE INDEX "College_city_idx" ON "College"("city");

-- CreateIndex
CREATE INDEX "College_type_idx" ON "College"("type");

-- CreateIndex
CREATE INDEX "Program_branchCode_idx" ON "Program"("branchCode");

-- CreateIndex
CREATE INDEX "Program_annualFee_idx" ON "Program"("annualFee");

-- CreateIndex
CREATE INDEX "Program_examAccepted_idx" ON "Program"("examAccepted");

-- CreateIndex
CREATE UNIQUE INDEX "Program_collegeId_branchCode_examAccepted_key" ON "Program"("collegeId", "branchCode", "examAccepted");

-- CreateIndex
CREATE INDEX "Cutoff_closingRank_idx" ON "Cutoff"("closingRank");

-- CreateIndex
CREATE INDEX "Cutoff_category_idx" ON "Cutoff"("category");

-- CreateIndex
CREATE INDEX "Cutoff_year_idx" ON "Cutoff"("year");

-- CreateIndex
CREATE UNIQUE INDEX "Cutoff_programId_year_round_category_key" ON "Cutoff"("programId", "year", "round", "category");

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cutoff" ADD CONSTRAINT "Cutoff_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cutoff" ADD CONSTRAINT "Cutoff_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "DataSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;
