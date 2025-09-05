import { db } from './db'
import { Icon } from '@prisma/client'

/**
 * Sets up marketplace sidebar options for agencies and subaccounts
 */

export const setupMarketplaceSidebar = async (agencyId: string) => {
  try {
    // Agency marketplace sidebar options
    const agencyMarketplaceOptions = [
      {
        name: 'Marketplace',
        icon: Icon.store,
        link: `/agency/${agencyId}/marketplace`,
      },
      {
        name: 'My Themes',
        icon: Icon.themes,
        link: `/agency/${agencyId}/marketplace/themes`,
      },
      {
        name: 'My Plugins',
        icon: Icon.plugins,
        link: `/agency/${agencyId}/marketplace/plugins`,
      },
      {
        name: 'Sell Dashboard',
        icon: Icon.dollarsign,
        link: `/agency/${agencyId}/marketplace/sell`,
      },
    ]

    // Create agency marketplace sidebar options
    for (const option of agencyMarketplaceOptions) {
      // Check if option already exists
      const existingOption = await db.agencySidebarOption.findFirst({
        where: {
          agencyId,
          name: option.name,
        },
      })

      if (!existingOption) {
        await db.agencySidebarOption.create({
          data: {
            ...option,
            agencyId,
          },
        })
      }
    }

    // Get all subaccounts for this agency
    const subaccounts = await db.subAccount.findMany({
      where: { agencyId },
    })

    // Setup subaccount marketplace sidebar options
    for (const subaccount of subaccounts) {
      const subaccountMarketplaceOptions = [
        {
          name: 'Marketplace',
          icon: Icon.store,
          link: `/subaccount/${subaccount.id}/marketplace`,
        },
        {
          name: 'My Themes',
          icon: Icon.themes,
          link: `/subaccount/${subaccount.id}/marketplace/themes`,
        },
        {
          name: 'My Plugins',
          icon: Icon.plugins,
          link: `/subaccount/${subaccount.id}/marketplace/plugins`,
        },
        {
          name: 'Import to Funnel',
          icon: Icon.package,
          link: `/subaccount/${subaccount.id}/marketplace/import`,
        },
      ]

      for (const option of subaccountMarketplaceOptions) {
        // Check if option already exists
        const existingOption = await db.subAccountSidebarOption.findFirst({
          where: {
            subAccountId: subaccount.id,
            name: option.name,
          },
        })

        if (!existingOption) {
          await db.subAccountSidebarOption.create({
            data: {
              ...option,
              subAccountId: subaccount.id,
            },
          })
        }
      }
    }

    console.log('✅ Marketplace sidebar options setup completed')
    return { success: true }
  } catch (error) {
    console.error('❌ Error setting up marketplace sidebar:', error)
    return { success: false, error }
  }
}

export const setupMarketplaceSidebarForSubaccount = async (subaccountId: string) => {
  try {
    const subaccountMarketplaceOptions = [
      {
        name: 'Marketplace',
        icon: Icon.store,
        link: `/subaccount/${subaccountId}/marketplace`,
      },
      {
        name: 'My Themes',
        icon: Icon.themes,
        link: `/subaccount/${subaccountId}/marketplace/themes`,
      },
      {
        name: 'My Plugins',
        icon: Icon.plugins,
        link: `/subaccount/${subaccountId}/marketplace/plugins`,
      },
      {
        name: 'Import to Funnel',
        icon: Icon.package,
        link: `/subaccount/${subaccountId}/marketplace/import`,
      },
    ]

    for (const option of subaccountMarketplaceOptions) {
      // Check if option already exists
      const existingOption = await db.subAccountSidebarOption.findFirst({
        where: {
          subAccountId: subaccountId,
          name: option.name,
        },
      })

      if (!existingOption) {
        await db.subAccountSidebarOption.create({
          data: {
            ...option,
            subAccountId: subaccountId,
          },
        })
      }
    }

    console.log('✅ Marketplace sidebar options setup completed for subaccount')
    return { success: true }
  } catch (error) {
    console.error('❌ Error setting up marketplace sidebar for subaccount:', error)
    return { success: false, error }
  }
}