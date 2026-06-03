const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding started (safe rerun mode)...");

  // ----------------------------------------------------------------
  // Safe rerun: remove only DEMO-confidence records to avoid duplicates
  // Non-demo / verified data sources and their linked records are preserved
  // ----------------------------------------------------------------

  // Find existing DEMO data sources
  const demoDatasources = await prisma.dataSource.findMany({
    where: { confidence: "DEMO" },
    select: { id: true },
  });
  const demoSourceIds = demoDatasources.map((d) => d.id);

  // Delete cutoffs linked to DEMO sources
  if (demoSourceIds.length > 0) {
    await prisma.cutoff.deleteMany({
      where: { sourceId: { in: demoSourceIds } },
    });
  }

  // Delete colleges that have slugs used for demo (no programs will remain)
  const demoSlugs = [
    "lnct-bhopal",
    "tit-bhopal",
    "uit-rgpv-bhopal",
    "sgsits-indore",
    "mits-gwalior",
    "jec-jabalpur",
  ];

  // Programs under demo colleges will cascade-delete via onDelete: Cascade
  await prisma.college.deleteMany({
    where: { slug: { in: demoSlugs } },
  });

  // Delete DEMO data sources
  await prisma.dataSource.deleteMany({
    where: { confidence: "DEMO" },
  });

  console.log("Cleared existing DEMO records.");

  // ----------------------------------------------------------------
  // Create fresh DEMO dataset
  // ----------------------------------------------------------------

  const dataSource = await prisma.dataSource.create({
    data: {
      title: "Development Demo Dataset",
      sourceType: "DEMO",
      confidence: "DEMO",
      notes:
        "Temporary development data. Must be replaced or clearly labelled before final submission.",
      academicYear: "2025",
    },
  });
  console.log(`Created DataSource: ${dataSource.title}`);

  const colleges = [
    {
      name: "LNCT Bhopal",
      slug: "lnct-bhopal",
      city: "Bhopal",
      type: "PRIVATE",
      programs: [
        { branchCode: "CSE", branchName: "Computer Science Engineering", annualFee: 120000, averagePackage: 5.2, highestPackage: 19.5, cutoffRank: 45000 },
        { branchCode: "AIML", branchName: "Artificial Intelligence & Machine Learning", annualFee: 125000, averagePackage: 4.8, highestPackage: 15.0, cutoffRank: 55000 },
      ],
    },
    {
      name: "TIT Bhopal",
      slug: "tit-bhopal",
      city: "Bhopal",
      type: "PRIVATE",
      programs: [
        { branchCode: "CSE", branchName: "Computer Science Engineering", annualFee: 90000, averagePackage: 3.8, highestPackage: 12.0, cutoffRank: 65000 },
        { branchCode: "IT", branchName: "Information Technology", annualFee: 85000, averagePackage: 3.5, highestPackage: 10.0, cutoffRank: 75000 },
      ],
    },
    {
      name: "UIT RGPV",
      slug: "uit-rgpv-bhopal",
      city: "Bhopal",
      type: "GOVERNMENT",
      programs: [
        { branchCode: "CSE", branchName: "Computer Science Engineering", annualFee: 45000, averagePackage: 4.5, highestPackage: 15.0, cutoffRank: 35000 },
        { branchCode: "IT", branchName: "Information Technology", annualFee: 45000, averagePackage: 4.0, highestPackage: 12.0, cutoffRank: 42000 },
        { branchCode: "EC", branchName: "Electronics & Communication Engineering", annualFee: 45000, averagePackage: 3.8, highestPackage: 10.0, cutoffRank: 48000 },
      ],
    },
    {
      name: "SGSITS Indore",
      slug: "sgsits-indore",
      city: "Indore",
      type: "AUTONOMOUS",
      programs: [
        { branchCode: "CSE", branchName: "Computer Science Engineering", annualFee: 95000, averagePackage: 8.5, highestPackage: 32.0, cutoffRank: 12000 },
        { branchCode: "IT", branchName: "Information Technology", annualFee: 95000, averagePackage: 7.5, highestPackage: 24.0, cutoffRank: 18000 },
        { branchCode: "EC", branchName: "Electronics & Communication Engineering", annualFee: 95000, averagePackage: 6.5, highestPackage: 18.0, cutoffRank: 22000 },
      ],
    },
    {
      name: "MITS Gwalior",
      slug: "mits-gwalior",
      city: "Gwalior",
      type: "AUTONOMOUS",
      programs: [
        { branchCode: "CSE", branchName: "Computer Science Engineering", annualFee: 85000, averagePackage: 5.5, highestPackage: 20.0, cutoffRank: 28000 },
        { branchCode: "IT", branchName: "Information Technology", annualFee: 85000, averagePackage: 5.0, highestPackage: 16.0, cutoffRank: 34000 },
      ],
    },
    {
      name: "JEC Jabalpur",
      slug: "jec-jabalpur",
      city: "Jabalpur",
      type: "GOVERNMENT",
      programs: [
        { branchCode: "CSE", branchName: "Computer Science Engineering", annualFee: 50000, averagePackage: 6.0, highestPackage: 24.0, cutoffRank: 25000 },
        { branchCode: "IT", branchName: "Information Technology", annualFee: 50000, averagePackage: 5.5, highestPackage: 18.0, cutoffRank: 30000 },
        { branchCode: "ME", branchName: "Mechanical Engineering", annualFee: 50000, averagePackage: 4.5, highestPackage: 12.0, cutoffRank: 38000 },
      ],
    },
  ];

  for (const col of colleges) {
    const createdCollege = await prisma.college.create({
      data: { name: col.name, slug: col.slug, city: col.city, type: col.type },
    });
    console.log(`Created College: ${createdCollege.name}`);

    for (const prog of col.programs) {
      const createdProgram = await prisma.program.create({
        data: {
          collegeId: createdCollege.id,
          branchCode: prog.branchCode,
          branchName: prog.branchName,
          annualFee: prog.annualFee,
          examAccepted: "JEE_MAIN",
          averagePackage: prog.averagePackage,
          highestPackage: prog.highestPackage,
          placementYear: "2024",
        },
      });

      await prisma.cutoff.create({
        data: {
          programId: createdProgram.id,
          sourceId: dataSource.id,
          counsellingAuthority: "DTE MP",
          year: 2025,
          round: 1,
          category: "GENERAL",
          closingRank: prog.cutoffRank,
        },
      });
    }
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
