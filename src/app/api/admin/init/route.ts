import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import { createAdminUser, getAdminUser } from "@/lib/queries";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is already an admin
    const existingAdmin = await getAdminUser(user.id);
    if (existingAdmin) {
      return NextResponse.json({
        message: "User is already an admin",
        adminUser: existingAdmin,
      });
    }

    // Check if this is the first user (should be super admin)
    const userCount = await db.user.count();
    const isSuperAdmin = userCount <= 1;

    // Default admin permissions
    const permissions = [
      "manage_users",
      "manage_agencies",
      "view_analytics",
      "manage_features",
      "manage_support",
      "manage_api",
      "manage_announcements",
      "view_audit_logs",
      "manage_backups",
      "manage_settings",
    ];

    if (isSuperAdmin) {
      permissions.push("manage_system", "manage_security");
    }

    const adminUser = await createAdminUser(user.id, permissions, isSuperAdmin);

    // Update system configs to have proper admin reference
    if (isSuperAdmin) {
      await db.systemConfig.updateMany({
        where: { lastModifiedBy: "system" },
        data: { lastModifiedBy: adminUser.id },
      });
    }

    return NextResponse.json({
      message: "Admin user created successfully",
      adminUser,
      isSuperAdmin,
    });
  } catch (error) {
    console.error("Admin initialization error:", error);
    return NextResponse.json(
      { error: "Failed to initialize admin user" },
      { status: 500 },
    );
  }
}
// import { NextRequest, NextResponse } from 'next/server'
// import { currentUser } from '@clerk/nextjs/server'
// import { createAdminUser } from '@/lib/queries'

// export async function POST(req: NextRequest) {
//   try {
//     const user = await currentUser()

//     if (!user) {
//       return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
//     }

//     // Check if this is the first admin (you might want to add additional security here)
//     const adminPermissions = [
//       'users.manage',
//       'agencies.manage',
//       'system.config',
//       'analytics.view',
//       'support.manage',
//       'marketplace.manage'
//     ]

//     const adminUser = await createAdminUser(
//       user.id,
//       adminPermissions,
//       true // isSuperAdmin
//     )

//     return NextResponse.json({
//       success: true,
//       adminUser,
//       message: 'Super admin created successfully'
//     })

//   } catch (error: any) {
//     console.error('Error creating super admin:', error)
//     return NextResponse.json(
//       { error: 'Failed to create super admin', details: error.message },
//       { status: 500 }
//     )
//   }
// }
