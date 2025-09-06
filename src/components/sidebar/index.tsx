import { getAuthUserDetails } from '@/lib/queries'
import React from 'react'
import MenuOptions from './menu-options'

type Props = {
  id: string
  type: 'agency' | 'subaccount' | 'individual'
}

const Sidebar = async ({ id, type }: Props) => {
  const user = await getAuthUserDetails()
  if (!user) return null

  // Handle Individual type
  if (type === 'individual') {
    const individualDetails = {
      name: 'Individual Account',
      address: user.email || 'Individual User',
    }

    const individualSidebarOptions = [
      { id: '1', name: 'Dashboard', link: `/individual/${id}`, icon: 'category' },
      { id: '2', name: 'Launchpad', link: `/individual/${id}/launchpad`, icon: 'clipboardIcon' },
      { id: '3', name: 'Billing', link: `/individual/${id}/billing`, icon: 'payment' },
      { id: '4', name: 'Settings', link: `/individual/${id}/settings`, icon: 'settings' },
      { id: '5', name: 'Funnels', link: `/individual/${id}/funnels`, icon: 'pipelines' },
      { id: '6', name: 'Media', link: `/individual/${id}/media`, icon: 'database' },
      { id: '7', name: 'Automations', link: `/individual/${id}/automations`, icon: 'send' },
      { id: '8', name: 'Pipelines', link: `/individual/${id}/pipelines`, icon: 'flag' },
      { id: '9', name: 'Contacts', link: `/individual/${id}/contacts`, icon: 'person' },
      { id: '10', name: 'Marketplace', link: `/individual/${id}/marketplace`, icon: 'store' },
      { id: '11', name: 'Analytics', link: `/individual/${id}/analytics`, icon: 'chart' },
      { id: '12', name: 'E-commerce', link: `/individual/${id}/ecommerce`, icon: 'shopping' },
      { id: '13', name: 'Team Collaboration', link: `/individual/${id}/team`, icon: 'messages' },
      { id: '14', name: 'Integrations', link: `/individual/${id}/integrations`, icon: 'link' },
    ]

    // FIX: Removed the duplicate MenuOptions component. It should only be rendered once.
    return (
      <MenuOptions
        defaultOpen={true}
        details={individualDetails}
        id={id}
        sidebarLogo="/assets/plura-logo.svg"
        sidebarOpt={individualSidebarOptions}
        subAccounts={[]}
        user={user}
        type={type}
      />
    )
  }

  // Handle agency and subaccount types
  if (!user.Agency) return null

  const details =
    type === 'agency'
      ? user.Agency
      : user.Agency.SubAccount.find((subaccount) => subaccount.id === id)

  if (!details) return

  const isWhiteLabeledAgency = user.Agency.whiteLabel
  let sideBarLogo = user.Agency.agencyLogo || '/assets/plura-logo.svg'

  if (!isWhiteLabeledAgency) {
    if (type === 'subaccount') {
      sideBarLogo =
        user.Agency.SubAccount.find((subaccount) => subaccount.id === id)
          ?.subAccountLogo || user.Agency.agencyLogo
    }
  }

  const sidebarOpt =
    type === 'agency'
      ? user.Agency.SidebarOption || []
      : user.Agency.SubAccount.find((subaccount) => subaccount.id === id)
          ?.SidebarOption || []

  const subaccounts = user.Agency.SubAccount.filter((subaccount) =>
    user.Permissions.find(
      (permission) =>
        permission.subAccountId === subaccount.id && permission.access
    )
  )

  // FIX: Removed the duplicate MenuOptions component here as well.
  return (
    <MenuOptions
      defaultOpen={true}
      details={details}
      id={id}
      sidebarLogo={sideBarLogo}
      sidebarOpt={sidebarOpt}
      subAccounts={subaccounts}
      user={user}
      type={type}
    />
  )
}

export default Sidebar
