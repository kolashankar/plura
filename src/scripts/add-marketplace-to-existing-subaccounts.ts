import { db } from '@/lib/db'

/**
 * Script to add marketplace sidebar option to all existing subaccounts
 * Run this once to update existing subaccounts with the marketplace tab
 */

export async function addMarketplaceToExistingSubaccounts() {
  try {
    console.log('🔄 Adding marketplace sidebar option to existing subaccounts...')
    
    // Get all subaccounts
    const subaccounts = await db.subAccount.findMany({
      select: { id: true, name: true }
    })

    console.log(`📊 Found ${subaccounts.length} subaccounts`)

    for (const subaccount of subaccounts) {
      // Check if marketplace option already exists
      const existingMarketplaceOption = await db.subAccountSidebarOption.findFirst({
        where: {
          subAccountId: subaccount.id,
          name: 'Marketplace'
        }
      })

      if (!existingMarketplaceOption) {
        // Add marketplace option
        await db.subAccountSidebarOption.create({
          data: {
            name: 'Marketplace',
            icon: 'store',
            link: '/marketplace',
            subAccountId: subaccount.id
          }
        })
        console.log(`✅ Added marketplace option to "${subaccount.name}"`)
      } else {
        console.log(`⏭️  Marketplace option already exists for "${subaccount.name}"`)
      }
    }

    console.log('🎉 Marketplace sidebar setup completed!')
    return { success: true, processed: subaccounts.length }
  } catch (error) {
    console.error('❌ Error adding marketplace to existing subaccounts:', error)
    return { success: false, error }
  }
}

// Run this function if called directly
if (require.main === module) {
  addMarketplaceToExistingSubaccounts()
    .then((result) => {
      if (result.success) {
        console.log(`✅ Successfully processed ${result.processed} subaccounts`)
      } else {
        console.error('❌ Script failed:', result.error)
      }
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Unexpected error:', error)
      process.exit(1)
    })
}