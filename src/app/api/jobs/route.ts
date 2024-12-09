// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { Prisma } from "@prisma/client";

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const search = searchParams.get("search") || undefined;
//   const type = searchParams.get("type") || undefined;
//   const location = searchParams.get("location") || undefined;
//   const workMode = searchParams.get("workMode") || undefined;
//   const page = parseInt(searchParams.get("page") || "1", 10);
//   const limit = parseInt(searchParams.get("limit") || "2", 10);
//   const offset = (page - 1) * limit; // Calculate offset

//   const whereClause: Prisma.JobWhereInput = {
//     ...(search && {
//       OR: [
//         { role: { contains: search, mode: Prisma.QueryMode.insensitive } },
//         {
//           companyName: { contains: search, mode: Prisma.QueryMode.insensitive },
//         },
//         {
//           skills: {
//             hasSome: [search],
//           },
//         },
//       ],
//     }),
//     ...(type &&
//       type !== "All" && {
//         type: { contains: type, mode: Prisma.QueryMode.insensitive },
//       }),
//     ...(location &&
//       location !== "All" && {
//         location: { contains: location, mode: Prisma.QueryMode.insensitive },
//       }),
//     ...(workMode &&
//       workMode !== "All" && {
//         workMode: { contains: workMode, mode: Prisma.QueryMode.insensitive },
//       }),
//   };

//   try {
//     const [jobs, totalJobs] = await prisma.$transaction([
//       prisma.job.findMany({
//         where: whereClause,
//         skip: offset,
//         take: limit,
//       }),
//       prisma.job.count({ where: whereClause }), // Total number of jobs
//     ]);

//     return NextResponse.json({
//       jobs,
//       totalJobs,
//       currentPage: page,
//       totalPages: Math.ceil(totalJobs / limit),
//     });
//   } catch (error) {
//     console.error("Error fetching jobs:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch jobs" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase() || undefined;
  const type = searchParams.get("type") || undefined;
  const location = searchParams.get("location") || undefined;
  const workMode = searchParams.get("workMode") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "2", 10);
  const offset = (page - 1) * limit;

  const whereClause: Prisma.JobWhereInput = {
    ...(search && {
      OR: [
        {
          role: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          role: {
            contains: search.replace(/[-\s]+/g, ""),
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          role: {
            contains: search.replace(/[-\s]+/g, "-"),
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          companyName: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          skills: {
            hasSome: [
              search,
              search.toLowerCase(),
              search.toUpperCase(),
              search.charAt(0).toUpperCase() + search.slice(1).toLowerCase(),
            ],
          },
        },
      ],
    }),
    ...(type &&
      type !== "All" && {
        type: { contains: type, mode: Prisma.QueryMode.insensitive },
      }),
    ...(location &&
      location !== "All" && {
        location: { contains: location, mode: Prisma.QueryMode.insensitive },
      }),
    ...(workMode &&
      workMode !== "All" && {
        workMode: { contains: workMode, mode: Prisma.QueryMode.insensitive },
      }),
  };

  try {
    const [jobs, totalJobs] = await prisma.$transaction([
      prisma.job.findMany({
        where: whereClause,
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: "desc", // Add sorting by creation date
        },
      }),
      prisma.job.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      jobs,
      totalJobs,
      currentPage: page,
      totalPages: Math.ceil(totalJobs / limit),
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
