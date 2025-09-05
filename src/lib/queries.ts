"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { redirect } from "next/navigation";
import {
  Agency,
  Individual,
  Lane,
  Plan,
  Prisma,
  Role,
  SubAccount,
  Tag,
  Ticket,
  User,
} from "@prisma/client";
import { v4 } from "uuid";
import {
  CreateFunnelFormSchema,
  CreateMediaType,
  UpsertFunnelPage,
} from "./types";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export const getAuthUserDetails = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return null;
    }

    if (!user.emailAddresses || user.emailAddresses.length === 0) {
      console.error('User has no email addresses');
      return null;
    }

    const userData = await db.user.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
      include: {
        Agency: {
          include: {
            SidebarOption: true,
            SubAccount: {
              include: {
                SidebarOption: true,
              },
            },
          },
        },
        Permissions: true,
      },
    });

    return userData;
  } catch (error) {
    console.error('Error in getAuthUserDetails:', error);
    return null;
  }
};

export const checkPremiumSubscription = async (agencyId: string) => {
  try {
    const agencyData = await db.agency.findUnique({
      where: { id: agencyId },
      include: {
        Subscription: true,
        AddOns: true,
      },
    });

    if (!agencyData) {
      return false;
    }

    // Check if they have an active subscription
    if (agencyData.Subscription?.active) {
      const priceId = agencyData.Subscription.priceId;
      
      // Check if it's a premium plan (Basic, Unlimited SaaS)
      const premiumPriceIds = [
        'price_1OzWu5SCZtpG0Bi9Vn0PF4Q5', // Basic
        'price_1OzWu4SCZtpG0Bi9uaOLW13b', // Unlimited SaaS
      ];

      if (premiumPriceIds.includes(priceId)) {
        return true;
      }

      // If user has any paid plan (not free), consider them premium
      const freePriceIds = ['', null, undefined, 'free'];
      if (!freePriceIds.includes(priceId)) {
        return true;
      }
    }

    // Check if they have any active ADD-ons that provide premium access
    if (agencyData.AddOns && agencyData.AddOns.length > 0) {
      const activeAddOns = agencyData.AddOns.filter(addon => 
        addon.active && 
        (
          addon.priceId === 'prod_PpBPcGW8vY2aNp' || // Priority Support
          addon.name?.toLowerCase().includes('priority') ||
          addon.name?.toLowerCase().includes('premium') ||
          addon.priceId === 'price_1PzBPcGW8vY2aNpABC123DEF' // $450 ADD-on
        )
      );

      if (activeAddOns.length > 0) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Error checking premium subscription:', error);
    return false;
  }
};

export const saveActivityLogsNotification = async ({
  agencyId,
  description,
  subaccountId,
}: {
  agencyId?: string;
  description: string;
  subaccountId?: string;
}) => {
  const authUser = await currentUser();
  let userData;
  if (!authUser) {
    const response = await db.user.findFirst({
      where: {
        Agency: {
          SubAccount: {
            some: { id: subaccountId },
          },
        },
      },
    });
    if (response) {
      userData = response;
    }
  } else {
    userData = await db.user.findUnique({
      where: { email: authUser?.emailAddresses[0].emailAddress },
    });
  }

  if (!userData) {
    console.log("Could not find a user");
    return;
  }

  let foundAgencyId = agencyId;
  if (!foundAgencyId) {
    if (!subaccountId) {
      throw new Error(
        "You need to provide atleast an agency Id or subaccount Id",
      );
    }
    const response = await db.subAccount.findUnique({
      where: { id: subaccountId },
    });
    if (response) foundAgencyId = response.agencyId;
  }
  if (subaccountId) {
    await db.notification.create({
      data: {
        notification: `${userData.name} | ${description}`,
        User: {
          connect: {
            id: userData.id,
          },
        },
        Agency: {
          connect: {
            id: foundAgencyId,
          },
        },
        SubAccount: {
          connect: { id: subaccountId },
        },
      },
    });
  } else {
    await db.notification.create({
      data: {
        notification: `${userData.name} | ${description}`,
        User: {
          connect: {
            id: userData.id,
          },
        },
        Agency: {
          connect: {
            id: foundAgencyId,
          },
        },
      },
    });
  }
};

export const createTeamUser = async (agencyId: string, user: User) => {
  if (user.role === "AGENCY_OWNER") return null;
  const response = await db.user.create({ data: { ...user } });
  return response;
};

export const verifyAndAcceptInvitation = async () => {
  const user = await currentUser();
  if (!user) return redirect("/sign-in");
  const invitationExists = await db.invitation.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
      status: "PENDING",
    },
  });

  if (invitationExists) {
    const userDetails = await createTeamUser(invitationExists.agencyId, {
      email: invitationExists.email,
      agencyId: invitationExists.agencyId,
      avatarUrl: user.imageUrl,
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      role: invitationExists.role,
      createdAt: new Date(),
      updatedAt: new Date(),
      plan: "STARTER",
      isActive: true,
      lastLoginAt: null,
    });
    await saveActivityLogsNotification({
      agencyId: invitationExists?.agencyId,
      description: `Joined`,
      subaccountId: undefined,
    });

    if (userDetails) {
      await clerkClient.users.updateUserMetadata(user.id, {
        privateMetadata: {
          role: userDetails.role || "SUBACCOUNT_USER",
        },
      });

      await db.invitation.delete({
        where: { email: userDetails.email },
      });

      return userDetails.agencyId;
    } else return null;
  } else {
    const agency = await db.user.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
    });
    return agency ? agency.agencyId : null;
  }
};

export const updateAgencyDetails = async (
  agencyId: string,
  agencyDetails: Partial<Agency>,
) => {
  const response = await db.agency.update({
    where: { id: agencyId },
    data: { ...agencyDetails },
  });
  return response;
};

export const deleteAgency = async (agencyId: string) => {
  const response = await db.agency.delete({ where: { id: agencyId } });
  return response;
};

export const initUser = async (newUser: Partial<User>) => {
  const user = await currentUser();
  if (!user) return;

  const userData = await db.user.upsert({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    update: newUser,
    create: {
      id: user.id,
      avatarUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      role: newUser.role || "SUBACCOUNT_USER",
    },
  });

  await clerkClient.users.updateUserMetadata(user.id, {
    privateMetadata: {
      role: newUser.role || "SUBACCOUNT_USER",
    },
  });

  return userData;
};

export const upsertAgency = async (agency: Agency, price?: Plan) => {
  if (!agency.companyEmail) return null;
  try {
    const agencyDetails = await db.agency.upsert({
      where: {
        id: agency.id,
      },
      update: agency,
      create: {
        users: {
          connect: { email: agency.companyEmail },
        },
        ...agency,
        SidebarOption: {
          create: [
            {
              name: "Dashboard",
              icon: "category",
              link: `/agency/${agency.id}`,
            },
            {
              name: "Launchpad",
              icon: "clipboardIcon",
              link: `/agency/${agency.id}/launchpad`,
            },
            {
              name: "Billing",
              icon: "payment",
              link: `/agency/${agency.id}/billing`,
            },
            {
              name: "Settings",
              icon: "settings",
              link: `/agency/${agency.id}/settings`,
            },
            {
              name: "Sub Accounts",
              icon: "person",
              link: `/agency/${agency.id}/all-subaccounts`,
            },
            {
              name: "Team",
              icon: "shield",
              link: `/agency/${agency.id}/team`,
            },
            {
              name: 'Marketplace',
              icon: 'store',
              link: `/agency/${agency.id}/marketplace`,
            },
            {
              name: 'My Themes',
              icon: 'themes',
              link: `/agency/${agency.id}/marketplace/themes`,
            },
            {
              name: 'My Plugins',
              icon: 'plugins',
              link: `/agency/${agency.id}/marketplace/plugins`,
            },
            {
              name: 'Sell Dashboard',
              icon: 'dollarsign',
              link: `/agency/${agency.id}/marketplace/sell`,
            },
          ],
        },
      },
    });
    return agencyDetails;
  } catch (error) {
    console.log(error);
  }
};

export const getNotificationAndUser = async (agencyId: string) => {
  try {
    const response = await db.notification.findMany({
      where: { agencyId },
      include: { User: true },
      orderBy: {
        createdAt: "desc",
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const upsertSubAccount = async (subAccount: SubAccount) => {
  if (!subAccount.companyEmail) return null;
  const agencyOwner = await db.user.findFirst({
    where: {
      Agency: {
        id: subAccount.agencyId,
      },
      role: "AGENCY_OWNER",
    },
  });
  if (!agencyOwner) return console.log("🔴Erorr could not create subaccount");
  const permissionId = v4();
  const response = await db.subAccount.upsert({
    where: { id: subAccount.id },
    update: subAccount,
    create: {
      ...subAccount,
      Permissions: {
        create: {
          access: true,
          email: agencyOwner.email,
          id: permissionId,
        },
        connect: {
          subAccountId: subAccount.id,
          id: permissionId,
        },
      },
      Pipeline: {
        create: { name: "Lead Cycle" },
      },
      SidebarOption: {
        create: [
          {
            name: "Launchpad",
            icon: "clipboardIcon",
            link: `/subaccount/${subAccount.id}/launchpad`,
          },
          {
            name: "Settings",
            icon: "settings",
            link: `/subaccount/${subAccount.id}/settings`,
          },
          {
            name: "Funnels",
            icon: "pipelines",
            link: `/subaccount/${subAccount.id}/funnels`,
          },
          {
            name: "Media",
            icon: "database",
            link: `/subaccount/${subAccount.id}/media`,
          },
          {
            name: "Automations",
            icon: "chip",
            link: `/subaccount/${subAccount.id}/automations`,
          },
          {
            name: "Pipelines",
            icon: "flag",
            link: `/subaccount/${subAccount.id}/pipelines`,
          },
          {
            name: "Contacts",
            icon: "person",
            link: `/subaccount/${subAccount.id}/contacts`,
          },
          {
            name: "Dashboard",
            icon: "category",
            link: `/subaccount/${subAccount.id}`,
          },
          {
            name: 'Marketplace',
            icon: 'store',
            link: `/marketplace`,
          },
          {
            name: 'My Themes',
            icon: 'themes',
            link: `/subaccount/${subAccount.id}/marketplace/themes`,
          },
          {
            name: 'My Plugins',
            icon: 'plugins',
            link: `/subaccount/${subAccount.id}/marketplace/plugins`,
          },
          {
            name: 'Import to Funnel',
            icon: 'package',
            link: `/subaccount/${subAccount.id}/marketplace/import`,
          },
        ],
      },
    },
  });
  return response;
};

export const upsertIndividual = async (individual: Individual) => {
  if (!individual.companyEmail) return null;
  
  const response = await db.individual.upsert({
    where: { id: individual.id },
    update: individual,
    create: {
      ...individual,
      Pipeline: {
        create: { name: "Lead Cycle" },
      },
    },
  });
  return response;
};

export const getUserPermissions = async (userId: string) => {
  const response = await db.user.findUnique({
    where: { id: userId },
    select: { Permissions: { include: { SubAccount: true } } },
  });

  return response;
};

export const updateUser = async (user: Partial<User>) => {
  const response = await db.user.update({
    where: { email: user.email },
    data: { ...user },
  });

  await clerkClient.users.updateUserMetadata(response.id, {
    privateMetadata: {
      role: user.role || "SUBACCOUNT_USER",
    },
  });

  return response;
};

export const changeUserPermissions = async (
  permissionId: string | undefined,
  userEmail: string,
  subAccountId: string,
  permission: boolean,
) => {
  try {
    const response = await db.permissions.upsert({
      where: { id: permissionId },
      update: { access: permission },
      create: {
        access: permission,
        email: userEmail,
        subAccountId: subAccountId,
      },
    });
    return response;
  } catch (error) {
    console.log("🔴Could not change persmission", error);
  }
};

export const getSubaccountDetails = async (subaccountId: string) => {
  const response = await db.subAccount.findUnique({
    where: {
      id: subaccountId,
    },
  });
  return response;
};

export const deleteSubAccount = async (subaccountId: string) => {
  const response = await db.subAccount.delete({
    where: {
      id: subaccountId,
    },
  });
  return response;
};

export const deleteUser = async (userId: string) => {
  await clerkClient.users.updateUserMetadata(userId, {
    privateMetadata: {
      role: undefined,
    },
  });
  const deletedUser = await db.user.delete({ where: { id: userId } });

  return deletedUser;
};

export const getUser = async (id: string) => {
  const user = await db.user.findUnique({
    where: {
      id,
    },
  });

  return user;
};

export const sendInvitation = async (
  role: Role,
  email: string,
  agencyId: string,
) => {
  const resposne = await db.invitation.create({
    data: { email, agencyId, role },
  });

  try {
    const invitation = await clerkClient.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: process.env.NEXT_PUBLIC_URL,
      publicMetadata: {
        throughInvitation: true,
        role,
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }

  return resposne;
};

export const getMedia = async (subaccountId: string) => {
  const mediafiles = await db.subAccount.findUnique({
    where: {
      id: subaccountId,
    },
    include: { Media: true },
  });
  return mediafiles;
};

export const createMedia = async (
  subaccountId: string,
  mediaFile: CreateMediaType,
) => {
  const response = await db.media.create({
    data: {
      link: mediaFile.link,
      name: mediaFile.name,
      subAccountId: subaccountId,
    },
  });

  return response;
};

export const deleteMedia = async (mediaId: string) => {
  const response = await db.media.delete({
    where: {
      id: mediaId,
    },
  });
  return response;
};

export const getPipelineDetails = async (pipelineId: string) => {
  const response = await db.pipeline.findUnique({
    where: {
      id: pipelineId,
    },
  });
  return response;
};

export const getLanesWithTicketAndTags = async (pipelineId: string) => {
  const response = await db.lane.findMany({
    where: {
      pipelineId,
    },
    orderBy: { order: "asc" },
    include: {
      Tickets: {
        orderBy: {
          order: "asc",
        },
        include: {
          Tags: true,
          Assigned: true,
          Customer: true,
        },
      },
    },
  });
  return response;
};

export const upsertFunnel = async (
  subaccountId: string,
  funnel: z.infer<typeof CreateFunnelFormSchema> & { liveProducts: string },
  funnelId: string,
) => {
  const response = await db.funnel.upsert({
    where: { id: funnelId },
    update: funnel,
    create: {
      ...funnel,
      id: funnelId || v4(),
      subAccountId: subaccountId,
    },
  });

  return response;
};

export const upsertPipeline = async (
  pipeline: Prisma.PipelineUncheckedCreateWithoutLaneInput,
) => {
  const response = await db.pipeline.upsert({
    where: { id: pipeline.id || v4() },
    update: pipeline,
    create: pipeline,
  });

  return response;
};

export const deletePipeline = async (pipelineId: string) => {
  const response = await db.pipeline.delete({
    where: { id: pipelineId },
  });
  return response;
};

export const updateLanesOrder = async (lanes: Lane[]) => {
  try {
    const updateTrans = lanes.map((lane) =>
      db.lane.update({
        where: {
          id: lane.id,
        },
        data: {
          order: lane.order,
        },
      }),
    );

    await db.$transaction(updateTrans);
    console.log("🟢 Done reordered 🟢");
  } catch (error) {
    console.log(error, "ERROR UPDATE LANES ORDER");
  }
};

export const updateTicketsOrder = async (tickets: Ticket[]) => {
  try {
    const updateTrans = tickets.map((ticket) =>
      db.ticket.update({
        where: {
          id: ticket.id,
        },
        data: {
          order: ticket.order,
          laneId: ticket.laneId,
        },
      }),
    );

    await db.$transaction(updateTrans);
    console.log("🟢 Done reordered 🟢");
  } catch (error) {
    console.log(error, "🔴 ERROR UPDATE TICKET ORDER");
  }
};

export const upsertLane = async (lane: Prisma.LaneUncheckedCreateInput) => {
  let order: number;

  if (!lane.order) {
    const lanes = await db.lane.findMany({
      where: {
        pipelineId: lane.pipelineId,
      },
    });

    order = lanes.length;
  } else {
    order = lane.order;
  }

  const response = await db.lane.upsert({
    where: { id: lane.id || v4() },
    update: lane,
    create: { ...lane, order },
  });

  return response;
};

export const deleteLane = async (laneId: string) => {
  const resposne = await db.lane.delete({ where: { id: laneId } });
  return resposne;
};

export const getTicketsWithTags = async (pipelineId: string) => {
  const response = await db.ticket.findMany({
    where: {
      Lane: {
        pipelineId,
      },
    },
    include: { Tags: true, Assigned: true, Customer: true },
  });
  return response;
};

export const _getTicketsWithAllRelations = async (laneId: string) => {
  const response = await db.ticket.findMany({
    where: { laneId: laneId },
    include: {
      Assigned: true,
      Customer: true,
      Lane: true,
      Tags: true,
    },
  });
  return response;
};

export const getSubAccountTeamMembers = async (subaccountId: string) => {
  const subaccountUsersWithAccess = await db.user.findMany({
    where: {
      Agency: {
        SubAccount: {
          some: {
            id: subaccountId,
          },
        },
      },
      role: "SUBACCOUNT_USER",
      Permissions: {
        some: {
          subAccountId: subaccountId,
          access: true,
        },
      },
    },
  });
  return subaccountUsersWithAccess;
};

export const searchContacts = async (searchTerms: string) => {
  const response = await db.contact.findMany({
    where: {
      name: {
        contains: searchTerms,
      },
    },
  });
  return response;
};

export const upsertTicket = async (
  ticket: Prisma.TicketUncheckedCreateInput,
  tags: Tag[],
) => {
  let order: number;
  if (!ticket.order) {
    const tickets = await db.ticket.findMany({
      where: { laneId: ticket.laneId },
    });
    order = tickets.length;
  } else {
    order = ticket.order;
  }

  const response = await db.ticket.upsert({
    where: {
      id: ticket.id || v4(),
    },
    update: { ...ticket, Tags: { set: tags } },
    create: { ...ticket, Tags: { connect: tags }, order },
    include: {
      Assigned: true,
      Customer: true,
      Tags: true,
      Lane: true,
    },
  });

  return response;
};

export const deleteTicket = async (ticketId: string) => {
  const response = await db.ticket.delete({
    where: {
      id: ticketId,
    },
  });

  return response;
};

export const upsertTag = async (
  subaccountId: string,
  tag: Prisma.TagUncheckedCreateInput,
) => {
  const response = await db.tag.upsert({
    where: { id: tag.id || v4(), subAccountId: subaccountId },
    update: tag,
    create: { ...tag, subAccountId: subaccountId },
  });

  return response;
};

export const getTagsForSubaccount = async (subaccountId: string) => {
  const response = await db.subAccount.findUnique({
    where: { id: subaccountId },
    select: { Tags: true },
  });
  return response;
};

export const deleteTag = async (tagId: string) => {
  const response = await db.tag.delete({ where: { id: tagId } });
  return response;
};

export const upsertContact = async (
  contact: Prisma.ContactUncheckedCreateInput,
) => {
  const response = await db.contact.upsert({
    where: { id: contact.id || v4() },
    update: contact,
    create: contact,
  });
  return response;
};

export const getFunnels = async (subacountId: string) => {
  const funnels = await db.funnel.findMany({
    where: { subAccountId: subacountId },
    include: { 
      FunnelPages: true,
      SubAccount: {
        select: {
          agencyId: true,
        },
      },
    },
  });

  return funnels;
};

export const getFunnel = async (funnelId: string) => {
  const funnel = await db.funnel.findUnique({
    where: { id: funnelId },
    include: {
      FunnelPages: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  return funnel;
};

export const updateFunnelProducts = async (
  products: string,
  funnelId: string,
) => {
  const data = await db.funnel.update({
    where: { id: funnelId },
    data: { liveProducts: products },
  });
  return data;
};

export const upsertFunnelPage = async (
  subaccountId: string,
  funnelPage: UpsertFunnelPage,
  funnelId: string,
) => {
  if (!subaccountId || !funnelId) return;
  const response = await db.funnelPage.upsert({
    where: { id: funnelPage.id || "" },
    update: { ...funnelPage },
    create: {
      ...funnelPage,
      content: funnelPage.content
        ? funnelPage.content
        : JSON.stringify([
            {
              content: [],
              id: "__body",
              name: "Body",
              styles: { backgroundColor: "white" },
              type: "__body",
            },
          ]),
      funnelId,
    },
  });

  revalidatePath(`/subaccount/${subaccountId}/funnels/${funnelId}`, "page");
  return response;
};

export const deleteFunnelePage = async (funnelPageId: string) => {
  const response = await db.funnelPage.delete({ where: { id: funnelPageId } });

  return response;
};

export const getFunnelPageDetails = async (funnelPageId: string) => {
  const response = await db.funnelPage.findUnique({
    where: {
      id: funnelPageId,
    },
  });

  return response;
};

export const getDomainContent = async (subDomainName: string) => {
  const response = await db.funnel.findUnique({
    where: {
      subDomainName,
    },
    include: { FunnelPages: true },
  });
  return response;
};

export const getPipelines = async (subaccountId: string) => {
  const response = await db.pipeline.findMany({
    where: { subAccountId: subaccountId },
    include: {
      Lane: {
        include: { Tickets: true },
      },
    },
  });
  return response;
};

export const getCustomComponents = async (subaccountId: string) => {
  const response = await db.customComponent.findMany({
    where: { subAccountId: subaccountId },
    orderBy: { createdAt: "desc" },
  });
  return response;
};

export const createCustomComponent = async (
  subaccountId: string,
  componentData: {
    name: string;
    type: string;
    content: any;
    styles: any;
    category?: string;
    code: string;
    createdBy: string;
  },
) => {
  const response = await db.customComponent.create({
    data: {
      ...componentData,
      subAccountId: subaccountId,
    },
  });
  return response;
};

export const updateCustomComponent = async (
  componentId: string,
  componentData: Partial<{
    name: string;
    type: string;
    content: any;
    styles: any;
    category: string;
    code: string;
    isActive: boolean;
  }>,
) => {
  const response = await db.customComponent.update({
    where: { id: componentId },
    data: componentData,
  });
  return response;
};

export const deleteCustomComponent = async (componentId: string) => {
  const response = await db.customComponent.delete({
    where: { id: componentId },
  });
  return response;
};

export const getDeployments = async (subaccountId: string) => {
  const response = await db.deployment.findMany({
    where: { subAccountId: subaccountId },
    orderBy: { createdAt: "desc" },
  });
  return response;
};

export const createDeployment = async (
  subaccountId: string,
  deploymentData: {
    name: string;
    type?: string;
    config?: any;
  },
) => {
  const response = await db.deployment.create({
    data: {
      ...deploymentData,
      subAccountId: subaccountId,
    },
  });
  return response;
};

export const updateDeployment = async (
  deploymentId: string,
  deploymentData: Partial<{
    name: string;
    url: string;
    status: string;
    type: string;
    config: any;
  }>,
) => {
  const response = await db.deployment.update({
    where: { id: deploymentId },
    data: deploymentData,
  });
  return response;
};

export const deleteDeployment = async (deploymentId: string) => {
  const response = await db.deployment.delete({
    where: { id: deploymentId },
  });
  return response;
};

export const getDatabases = async (subaccountId: string) => {
  const response = await db.database.findMany({
    where: { subaccountId },
    orderBy: { createdAt: "desc" },
  });
  return response;
};

export const createDatabase = async (
  subaccountId: string,
  databaseData: {
    name: string;
    provider: string;
    connectionString?: string;
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
    isDefault?: boolean;
  },
) => {
  // If setting as default, unset other defaults first
  if (databaseData.isDefault) {
    await db.database.updateMany({
      where: {
        subaccountId,
        isDefault: true,
      },
      data: { isDefault: false },
    });
  }

  const response = await db.database.create({
    data: {
      ...databaseData,
      subaccountId,
    },
  });
  return response;
};

export const getIntegrations = async (subaccountId: string) => {
  const response = await db.integration.findMany({
    where: { subaccountId },
    orderBy: { createdAt: "desc" },
  });
  return response;
};

export const createIntegration = async (
  subaccountId: string,
  integrationData: {
    name: string;
    provider: string;
    apiKey?: string;
    apiSecret?: string;
    webhookUrl?: string;
    config?: string;
  },
) => {
  const response = await db.integration.create({
    data: {
      ...integrationData,
      subaccountId,
    },
  });
  return response;
};

export const getAITemplates = async () => {
  const response = await db.aITemplate.findMany({
    where: { isActive: true },
    orderBy: { usageCount: "desc" },
  });
  return response;
};

export const createTeamInvitation = async (
  subaccountId: string,
  invitations: { email: string; role: Role; permissions: string[] }[],
) => {
  const responses = await Promise.all(
    invitations.map((invitation) =>
      db.invitation.create({
        data: {
          email: invitation.email,
          agencyId: "", // Will be set based on subaccount
          role: invitation.role,
          status: "PENDING",
        },
      }),
    ),
  );
  return responses;
};

export const getTeamAnalytics = async (subaccountId: string) => {
  const response = await db.user.groupBy({
    by: ["role"],
    where: {
      Permissions: {
        some: {
          subAccountId: subaccountId,
          access: true,
        },
      },
    },
    _count: true,
  });
  return response;
};

export const updateTemplateUsage = async (templateId: string) => {
  const response = await db.aITemplate.update({
    where: { id: templateId },
    data: {
      usageCount: {
        increment: 1,
      },
    },
  });
  return response;
};

// Admin User Management
export const createAdminUser = async (
  userId: string,
  permissions: string[],
  isSuperAdmin = false,
) => {
  const response = await db.adminUser.create({
    data: {
      userId,
      permissions: JSON.stringify(permissions),
      isSuperAdmin,
    },
    include: {
      User: true,
    },
  });
  return response;
};

export const getAdminUser = async (userId: string) => {
  const response = await db.adminUser.findUnique({
    where: { userId },
    include: {
      User: true,
    },
  });
  return response;
};

export const updateAdminPermissions = async (
  adminUserId: string,
  permissions: string[],
) => {
  const response = await db.adminUser.update({
    where: { id: adminUserId },
    data: {
      permissions: JSON.stringify(permissions),
    },
  });
  return response;
};

// Audit Logging
export const createAuditLog = async (
  adminUserId: string,
  action: string,
  entity: string,
  entityId?: string,
  oldValues?: any,
  newValues?: any,
  ipAddress?: string,
  userAgent?: string,
) => {
  const response = await db.auditLog.create({
    data: {
      adminUserId,
      action,
      entity,
      entityId,
      oldValues: oldValues ? JSON.stringify(oldValues) : null,
      newValues: newValues ? JSON.stringify(newValues) : null,
      ipAddress,
      userAgent,
    },
  });
  return response;
};

export const getAuditLogs = async (filters?: {
  entity?: string;
  adminUserId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
}) => {
  const where: any = {};

  if (filters?.entity) where.entity = filters.entity;
  if (filters?.adminUserId) where.adminUserId = filters.adminUserId;
  if (filters?.dateFrom || filters?.dateTo) {
    where.createdAt = {};
    if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
    if (filters.dateTo) where.createdAt.lte = filters.dateTo;
  }

  const response = await db.auditLog.findMany({
    where,
    include: {
      AdminUser: {
        include: {
          User: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: filters?.limit || 100,
  });
  return response;
};

// System Configuration
export const getSystemConfig = async (key?: string) => {
  if (key) {
    return await db.systemConfig.findUnique({
      where: { key },
      include: {
        AdminUser: {
          include: { User: true },
        },
      },
    });
  }

  return await db.systemConfig.findMany({
    include: {
      AdminUser: {
        include: { User: true },
      },
    },
    orderBy: { key: "asc" },
  });
};

export const updateSystemConfig = async (
  key: string,
  value: string,
  adminUserId: string,
  type = "string",
  description?: string,
  isPublic = false,
) => {
  const response = await db.systemConfig.upsert({
    where: { key },
    update: {
      value,
      type,
      description,
      isPublic,
      lastModifiedBy: adminUserId,
    },
    create: {
      key,
      value,
      type,
      description,
      isPublic,
      lastModifiedBy: adminUserId,
    },
  });
  return response;
};

// Feature Flags
export const getFeatureFlags = async () => {
  return await db.featureFlag.findMany({
    orderBy: { name: "asc" },
  });
};

export const updateFeatureFlag = async (
  id: string,
  data: {
    isEnabled?: boolean;
    rolloutType?: string;
    rolloutData?: any;
  },
) => {
  const response = await db.featureFlag.update({
    where: { id },
    data: {
      ...data,
      rolloutData: data.rolloutData
        ? JSON.stringify(data.rolloutData)
        : undefined,
    },
  });
  return response;
};

export const createFeatureFlag = async (
  name: string,
  key: string,
  description?: string,
  isEnabled = false,
) => {
  const response = await db.featureFlag.create({
    data: {
      name,
      key,
      description,
      isEnabled,
    },
  });
  return response;
};

export const deleteFeatureFlag = async (id: string) => {
  const response = await db.featureFlag.delete({
    where: { id },
  });
  return response;
};

// API Key Management
export const createApiKey = async (
  name: string,
  permissions: string[],
  agencyId?: string,
  subAccountId?: string,
  expiresAt?: Date,
) => {
  const keyValue = generateApiKey();
  const keyHash = await hashApiKey(keyValue);
  const keyPrefix = keyValue.substring(0, 8);

  const response = await db.apiKey.create({
    data: {
      name,
      keyHash,
      keyPrefix,
      permissions: JSON.stringify(permissions),
      agencyId,
      subAccountId,
      expiresAt,
    },
  });

  return { ...response, keyValue }; // Return the plain key only once
};

export const getApiKeys = async (agencyId?: string, subAccountId?: string) => {
  const where: any = { isActive: true };
  if (agencyId) where.agencyId = agencyId;
  if (subAccountId) where.subAccountId = subAccountId;

  return await db.apiKey.findMany({
    where,
    include: {
      Agency: true,
      SubAccount: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const revokeApiKey = async (keyId: string) => {
  return await db.apiKey.update({
    where: { id: keyId },
    data: { isActive: false },
  });
};

// Usage Metrics
export const recordUsageMetric = async (
  metricType: string,
  value: number,
  unit: string,
  agencyId?: string,
  subAccountId?: string,
  metadata?: any,
) => {
  const response = await db.usageMetric.create({
    data: {
      metricType,
      value,
      unit,
      agencyId,
      subAccountId,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });
  return response;
};

export const getUsageMetrics = async (
  metricType?: string,
  agencyId?: string,
  subAccountId?: string,
  dateFrom?: Date,
  dateTo?: Date,
) => {
  const where: any = {};

  if (metricType) where.metricType = metricType;
  if (agencyId) where.agencyId = agencyId;
  if (subAccountId) where.subAccountId = subAccountId;
  if (dateFrom || dateTo) {
    where.date = {};
    if (dateFrom) where.date.gte = dateFrom;
    if (dateTo) where.date.lte = dateTo;
  }

  return await db.usageMetric.findMany({
    where,
    include: {
      Agency: true,
      SubAccount: true,
    },
    orderBy: { date: "desc" },
  });
};

// Platform Analytics
export const updatePlatformAnalytics = async (data: {
  totalUsers?: number;
  totalAgencies?: number;
  totalSubAccounts?: number;
  totalRevenue?: number;
  activeUsers?: number;
  apiCalls?: number;
  storageUsed?: bigint;
  bandwidth?: bigint;
  metadata?: any;
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find existing record for today
  const existing = await db.platformAnalytics.findFirst({
    where: { date: today },
  });

  if (existing) {
    return await db.platformAnalytics.update({
      where: { id: existing.id },
      data: {
        ...data,
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      },
    });
  } else {
    return await db.platformAnalytics.create({
      data: {
        date: today,
        ...data,
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      },
    });
  }
};

export const getPlatformAnalytics = async (dateFrom?: Date, dateTo?: Date) => {
  const where: any = {};

  if (dateFrom || dateTo) {
    where.date = {};
    if (dateFrom) where.date.gte = dateFrom;
    if (dateTo) where.date.lte = dateTo;
  }

  return await db.platformAnalytics.findMany({
    where,
    orderBy: { date: "desc" },
  });
};

// Admin User Management
export const getAllUsers = async (filters?: {
  role?: Role;
  isActive?: boolean;
  agencyId?: string;
  search?: string;
}) => {
  const where: any = {};

  if (filters?.role) where.role = filters.role;
  if (filters?.isActive !== undefined) where.isActive = filters.isActive;
  if (filters?.agencyId) where.agencyId = filters.agencyId;
  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search } },
      { email: { contains: filters.search } },
    ];
  }

  return await db.user.findMany({
    where,
    include: {
      Agency: true,
      Permissions: {
        include: {
          SubAccount: true,
        },
      },
      AdminUser: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getAllAgencies = async (filters?: {
  isActive?: boolean;
  search?: string;
}) => {
  const where: any = {};

  if (filters?.isActive !== undefined) where.isActive = filters.isActive;
  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search } },
      { companyEmail: { contains: filters.search } },
    ];
  }

  return await db.agency.findMany({
    where,
    include: {
      users: true,
      SubAccount: true,
      Subscription: true,
      _count: {
        select: {
          users: true,
          SubAccount: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const suspendUser = async (userId: string, adminUserId: string) => {
  const oldUser = await db.user.findUnique({ where: { id: userId } });

  const response = await db.user.update({
    where: { id: userId },
    data: { isActive: false },
  });

  await createAuditLog(
    adminUserId,
    "SUSPEND_USER",
    "User",
    userId,
    { isActive: oldUser?.isActive },
    { isActive: false },
  );

  return response;
};

export const activateUser = async (userId: string, adminUserId: string) => {
  const oldUser = await db.user.findUnique({ where: { id: userId } });

  const response = await db.user.update({
    where: { id: userId },
    data: { isActive: true },
  });

  await createAuditLog(
    adminUserId,
    "ACTIVATE_USER",
    "User",
    userId,
    { isActive: oldUser?.isActive },
    { isActive: true },
  );

  return response;
};

export const suspendAgency = async (agencyId: string, adminUserId: string) => {
  const oldAgency = await db.agency.findUnique({ where: { id: agencyId } });

  const response = await db.agency.update({
    where: { id: agencyId },
    data: { isActive: false },
  });

  await createAuditLog(
    adminUserId,
    "SUSPEND_AGENCY",
    "Agency",
    agencyId,
    { isActive: oldAgency?.isActive },
    { isActive: false },
  );

  return response;
};

export const activateAgency = async (agencyId: string, adminUserId: string) => {
  const oldAgency = await db.agency.findUnique({ where: { id: agencyId } });

  const response = await db.agency.update({
    where: { id: agencyId },
    data: { isActive: true },
  });

  await createAuditLog(
    adminUserId,
    "ACTIVATE_AGENCY",
    "Agency",
    agencyId,
    { isActive: oldAgency?.isActive },
    { isActive: true },
  );

  return response;
};

// Support Tickets
export const createSupportTicket = async (
  title: string,
  description: string,
  userId: string,
  agencyId?: string,
  subAccountId?: string,
  priority = "medium",
  category = "general",
) => {
  return await db.supportTicket.create({
    data: {
      title,
      description,
      userId,
      agencyId,
      subAccountId,
      priority,
      category,
    },
    include: {
      User: true,
      Agency: true,
      SubAccount: true,
    },
  });
};

export const getSupportTickets = async (filters?: {
  status?: string;
  priority?: string;
  category?: string;
  assignedTo?: string;
  userId?: string;
  agencyId?: string;
}) => {
  const where: any = {};

  if (filters?.status) where.status = filters.status;
  if (filters?.priority) where.priority = filters.priority;
  if (filters?.category) where.category = filters.category;
  if (filters?.assignedTo) where.assignedTo = filters.assignedTo;
  if (filters?.userId) where.userId = filters.userId;
  if (filters?.agencyId) where.agencyId = filters.agencyId;

  return await db.supportTicket.findMany({
    where,
    include: {
      User: true,
      Agency: true,
      SubAccount: true,
      AssignedUser: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const updateSupportTicket = async (
  ticketId: string,
  data: {
    status?: string;
    priority?: string;
    assignedTo?: string;
    resolution?: string;
  },
) => {
  return await db.supportTicket.update({
    where: { id: ticketId },
    data,
    include: {
      User: true,
      Agency: true,
      SubAccount: true,
      AssignedUser: true,
    },
  });
};

// Announcements
export const createAnnouncement = async (
  title: string,
  content: string,
  type = "info",
  priority = "normal",
  targetType = "all",
  targetIds?: string[],
  publishAt?: Date,
  expiresAt?: Date,
) => {
  return await db.announcement.create({
    data: {
      title,
      content,
      type,
      priority,
      targetType,
      targetIds: targetIds ? JSON.stringify(targetIds) : null,
      publishAt,
      expiresAt,
      isPublished: publishAt ? publishAt <= new Date() : true,
    },
  });
};

export const getAnnouncements = async (
  targetType?: string,
  targetId?: string,
) => {
  const where: any = {
    isPublished: true,
    OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
  };

  if (targetType && targetId) {
    where.OR = [
      { targetType: "all" },
      {
        AND: [{ targetType }, { targetIds: { contains: targetId } }],
      },
    ];
  }

  return await db.announcement.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
};

// Backup Management
export const createBackupJob = async (
  name: string,
  type: string,
  targetType: string,
  targetIds?: string[],
  scheduledAt?: Date,
) => {
  return await db.backupJob.create({
    data: {
      name,
      type,
      targetType,
      targetIds: targetIds ? JSON.stringify(targetIds) : null,
      scheduledAt,
    },
  });
};

export const getBackupJobs = async (status?: string) => {
  const where: any = {};
  if (status) where.status = status;

  return await db.backupJob.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
};

export const updateBackupJob = async (
  jobId: string,
  data: {
    status?: string;
    progress?: number;
    size?: bigint;
    location?: string;
    errorLog?: string;
    startedAt?: Date;
    completedAt?: Date;
  },
) => {
  return await db.backupJob.update({
    where: { id: jobId },
    data,
  });
};

// Helper functions for API keys
function generateApiKey(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "sk_";
  for (let i = 0; i < 48; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function hashApiKey(key: string): Promise<string> {
  // In a real implementation, use bcrypt or similar
  const crypto = require("crypto");
  return crypto.createHash("sha256").update(key).digest("hex");
}
