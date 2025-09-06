'use client'

import { PricesList, TicketDetails } from '@/lib/types'
import { Agency, Contact, Plan, User } from '@prisma/client'
import React, { 
    createContext, 
    useContext, 
    useEffect, 
    useState, 
    useCallback, 
    useMemo 
} from 'react'

interface ModalProviderProps {
  children: React.ReactNode
}

export type ModalData = {
  user?: User
  agency?: Agency
  ticket?: TicketDetails[0]
  contact?: Contact
  plans?: {
    defaultPriceId: Plan
    plans: PricesList['data']
  }
}

type ModalContextType = {
  data: ModalData
  isOpen: boolean
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => void
  setClose: () => void
}

export const ModalContext = createContext<ModalContextType>({
  data: {},
  isOpen: false,
  setOpen: () => {},
  setClose: () => {},
})

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<ModalData>({})
  const [showingModal, setShowingModal] = useState<React.ReactNode>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // The 'setOpen' function is wrapped in useCallback.
  // This ensures the function is not recreated on every render, preventing infinite loops.
  // Using a functional update for `setData` (prevData => ...) removes the need to list `data` as a dependency.
  const setOpen = useCallback(async (
    modal: React.ReactNode,
    fetchData?: () => Promise<any>
  ) => {
    if (modal) {
      if (fetchData) {
        const fetchedData = await fetchData()
        setData(prevData => ({ ...prevData, ...(fetchedData || {}) }))
      }
      setShowingModal(modal)
      setIsOpen(true)
    }
  }, [])

  // The 'setClose' function is also wrapped in useCallback for stability.
  const setClose = useCallback(() => {
    setIsOpen(false)
    setData({})
    setShowingModal(null) // Also clears the modal component
  }, [])

  // useMemo memoizes the context value object.
  // This is a performance optimization that prevents consumers of the context
  // from re-rendering unnecessarily when the provider's parent re-renders.
  const contextValue = useMemo(() => ({
    data,
    isOpen,
    setOpen,
    setClose,
  }), [data, isOpen, setOpen, setClose])

  if (!isMounted) return null

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {showingModal}
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within the modal provider')
  }
  return context
}

export default ModalProvider