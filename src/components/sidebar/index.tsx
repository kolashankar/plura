import { getAuthUserDetails } from '@/lib/queries'
import { off } from 'process'
import React from 'react'
import MenuOptions from './menu-options'

type Props = {
  id: string
  type: 'agency' | 'subaccount' | 'individual'
}

const Sidebar = async ({ id, type }: Props) => {
  const user = await getAuthUserDetails()
  if (!user) return null

  // Handle Individual type differently
  if (type === 'individual') {
    const individualDetails = {
      name: 'Individual Account',
      address: user.email || 'Individual User',
    }

    const individualSidebarOptions = [
      { id: '1', name: 'Dashboard', link: `/Individual/${id}`, icon: 'category' },
      { id: '2', name: 'Launchpad', link: `/Individual/${id}/launchpad`, icon: 'clipboardIcon' },
      { id: '3', name: 'Billing', link: `/Individual/${id}/billing`, icon: 'payment' },
      { id: '4', name: 'Settings', link: `/Individual/${id}/settings`, icon: 'settings' },
      { id: '5', name: 'Funnels', link: `/Individual/${id}/funnels`, icon: 'pipelines' },
      { id: '6', name: 'Media', link: `/Individual/${id}/media`, icon: 'database' },
      { id: '7', name: 'Automations', link: `/Individual/${id}/automations`, icon: 'send' },
      { id: '8', name: 'Pipelines', link: `/Individual/${id}/pipelines`, icon: 'flag' },
      { id: '9', name: 'Contacts', link: `/Individual/${id}/contacts`, icon: 'person' },
      { id: '10', name: 'Marketplace', link: `/Individual/${id}/marketplace`, icon: 'store' },
      { id: '11', name: 'Analytics', link: `/Individual/${id}/analytics`, icon: 'chart' },
      { id: '12', name: 'E-commerce', link: `/Individual/${id}/ecommerce`, icon: 'shopping' },
      { id: '13', name: 'Team Collaboration', link: `/Individual/${id}/team`, icon: 'messages' },
      { id: '14', name: 'Integrations', link: `/Individual/${id}/integrations`, icon: 'link' },
    ]

    return (
      <>
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
        <MenuOptions
          details={individualDetails}
          id={id}
          sidebarLogo="/assets/plura-logo.svg"
          sidebarOpt={individualSidebarOptions}
          subAccounts={[]}
          user={user}
          type={type}
        />
      </>
    )
  }

  // Handle agency and subaccount types as before
  if (!user.Agency) return null

  const details =
    type === 'agency'
      ? user?.Agency
      : user?.Agency.SubAccount.find((subaccount) => subaccount.id === id)

  const isWhiteLabeledAgency = user.Agency.whiteLabel
  if (!details) return

  let sideBarLogo = user.Agency.agencyLogo || '/assets/plura-logo.svg'

  if (!isWhiteLabeledAgency) {
    if (type === 'subaccount') {
      sideBarLogo =
        user?.Agency.SubAccount.find((subaccount) => subaccount.id === id)
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

  return (
    <>
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
      <MenuOptions
        details={details}
        id={id}
        sidebarLogo={sideBarLogo}
        sidebarOpt={sidebarOpt}
        subAccounts={subaccounts}
        user={user}
        type={type}
      />
    </>
  )
}

export default Sidebar
