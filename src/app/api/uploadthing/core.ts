import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const f = createUploadthing();

const authenticateUser = async () => {
  // First try Clerk authentication
  const user = auth();
  if (user) {
    return user;
  }

  // If Clerk auth fails, try admin JWT token
  try {
    const cookieStore = cookies();
    const adminToken = cookieStore.get('admin-token')?.value;
    
    if (adminToken) {
      const secret = new TextEncoder().encode(
        process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || 'default-secret-change-in-production'
      );
      
      const { payload } = await jwtVerify(adminToken, secret);
      
      if (payload && payload.role === 'admin') {
        // Return admin user info in Clerk-like format
        return {
          userId: payload.userId as string,
          emailAddresses: [{ emailAddress: payload.email as string }],
          isAdmin: true
        };
      }
    }
  } catch (error) {
    console.error('Admin auth error in uploadthing:', error);
  }

  throw new Error("Unauthorized");
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  subaccountLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(() => {}),
  avatar: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(() => {}),
  agencyLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(() => {}),
  media: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
