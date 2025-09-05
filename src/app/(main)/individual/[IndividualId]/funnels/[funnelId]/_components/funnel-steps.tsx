'use client'
import CreateFunnelPage from '@/components/forms/funnel-page'
import CustomModal from '@/components/global/custom-modal'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from '@/components/ui/use-toast'
import { upsertFunnelPage } from '@/lib/queries'
import { FunnelsForSubAccount } from '@/lib/types'
import { useModal } from '@/providers/modal-provider'
import { FunnelPage } from '@prisma/client'
import { Check, ExternalLink, LucideEdit, UserCog, Wand2 } from 'lucide-react'
import React, { useState } from 'react'

import {
  DragDropContext,
  DragStart,
  DropResult,
  Droppable,
} from 'react-beautiful-dnd'
import Link from 'next/link'
import FunnelPagePlaceholder from '@/components/icons/funnel-page-placeholder'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import FunnelStepCard from './funnel-step-card'

type Props = {
  funnel: FunnelsForSubAccount
  subaccountId: string
  pages: FunnelPage[]
  funnelId: string
}

const FunnelSteps = ({ funnel, funnelId, pages, subaccountId }: Props) => {
  const [clickedPage, setClickedPage] = useState<FunnelPage | undefined>(
    pages[0]
  )
  const { setOpen } = useModal()
  const [pagesState, setPagesState] = useState(pages)
  const [funnelPrompt, setFunnelPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const onDragStart = (event: DragStart) => {
    //current chosen page
    const { draggableId } = event
    const value = pagesState.find((page) => page.id === draggableId)
  }

  const onDragEnd = (dropResult: DropResult) => {
    const { destination, source } = dropResult

    //no destination or same position
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return
    }
    //change state
    const newPageOrder = [...pagesState]
      .toSpliced(source.index, 1)
      .toSpliced(destination.index, 0, pagesState[source.index])
      .map((page, idx) => {
        return { ...page, order: idx }
      })

    setPagesState(newPageOrder)
    newPageOrder.forEach(async (page, index) => {
      try {
        await upsertFunnelPage(
          subaccountId,
          {
            id: page.id,
            order: index,
            name: page.name,
          },
          funnelId
        )
      } catch (error) {
        console.log(error)
        toast({
          variant: 'destructive',
          title: 'Failed',
          description: 'Could not save page order',
        })
        return
      }
    })

    toast({
      title: 'Success',
      description: 'Saved page order',
    })
  }

  const generateFunnelPages = async () => {
    if (!funnelPrompt.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a prompt for funnel generation',
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-funnel-pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: funnelPrompt,
          funnelId,
          subaccountId,
          existingPages: pagesState,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate funnel pages')
      }

      const data = await response.json()
      
      if (data.pages && Array.isArray(data.pages)) {
        // Add the new generated pages to the state
        const newPages = [...pagesState, ...data.pages]
        setPagesState(newPages)
        
        // Set the first generated page as clicked if no page was selected
        if (!clickedPage && data.pages.length > 0) {
          setClickedPage(data.pages[0])
        }

        toast({
          title: 'Success',
          description: `Generated ${data.pages.length} funnel pages successfully!`,
        })
      }
      
      setFunnelPrompt('')
    } catch (error) {
      console.error('Error generating funnel pages:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate funnel pages',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <AlertDialog>
      <div className="flex border-[1px] lg:!flex-row flex-col ">
        <aside className="flex-[0.3] bg-background p-6  flex flex-col justify-between ">
          <Tabs defaultValue="steps" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="steps" className="flex items-center gap-2">
                <Check size={16} />
                Steps
              </TabsTrigger>
              <TabsTrigger value="agent" className="flex items-center gap-2">
                <UserCog size={16} />
                AI Agent
              </TabsTrigger>
            </TabsList>

            <TabsContent value="steps" className="flex-1 flex flex-col">
              <ScrollArea className="h-full ">
                <div className="flex gap-4 items-center mb-4">
                  <Check />
                  Funnel Steps
                </div>
                {pagesState.length ? (
                  <DragDropContext
                    onDragEnd={onDragEnd}
                    onDragStart={onDragStart}
                  >
                    <Droppable
                      droppableId="funnels"
                      direction="vertical"
                      key="funnels"
                    >
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {pagesState.map((page, idx) => (
                            <div
                              className="relative"
                              key={page.id}
                              onClick={() => setClickedPage(page)}
                            >
                              <FunnelStepCard
                                funnelPage={page}
                                index={idx}
                                key={page.id}
                                activePage={page.id === clickedPage?.id}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                ) : (
                  <div className="text-center text-muted-foreground py-6">
                    No Pages
                  </div>
                )}
              </ScrollArea>
              <Button
                className="mt-4 w-full"
                onClick={() => {
                  setOpen(
                    <CustomModal
                      title=" Create or Update a Funnel Page"
                      subheading="Funnel Pages allow you to create step by step processes for customers to follow"
                    >
                      <CreateFunnelPage
                        subaccountId={subaccountId}
                        funnelId={funnelId}
                        order={pagesState.length}
                      />
                    </CustomModal>
                  )
                }}
              >
                Create New Steps
              </Button>
            </TabsContent>

            <TabsContent value="agent" className="flex-1 flex flex-col">
              <div className="space-y-4 h-full">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Wand2 className="h-5 w-5" />
                    Generate Funnel Pages
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create multiple funnel pages at once using AI
                  </p>
                </div>
                
                <div className="space-y-3 flex-1 flex flex-col">
                  <Label htmlFor="funnel-prompt">Describe your funnel</Label>
                  <Textarea
                    id="funnel-prompt"
                    placeholder="Describe the complete funnel you want to create (e.g., 'Create a fitness coaching funnel with landing page, about page, pricing, testimonials, and checkout pages')"
                    value={funnelPrompt}
                    onChange={(e) => setFunnelPrompt(e.target.value)}
                    className="min-h-[100px] flex-1"
                  />
                  <Button 
                    onClick={generateFunnelPages}
                    disabled={isGenerating || !funnelPrompt.trim()}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Generating Pages...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate Funnel Pages
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </aside>
        <aside className="flex-[0.7] bg-muted p-4 ">
          {!!pages.length ? (
            <Card className="h-full flex justify-between flex-col">
              <CardHeader>
                <p className="text-sm text-muted-foreground">Page name</p>
                <CardTitle>{clickedPage?.name}</CardTitle>
                <CardDescription className="flex flex-col gap-4">
                  <div className="border-2 rounded-lg sm:w-80 w-full  overflow-clip">
                    <Link
                      href={`/subaccount/${subaccountId}/funnels/${funnelId}/editor/${clickedPage?.id}`}
                      className="relative group"
                    >
                      <div className="cursor-pointer group-hover:opacity-30 w-full">
                        <FunnelPagePlaceholder />
                      </div>
                      <LucideEdit
                        size={50}
                        className="!text-muted-foreground absolute top-1/2 left-1/2 opacity-0 transofrm -translate-x-1/2 -translate-y-1/2 group-hover:opacity-100 transition-all duration-100"
                      />
                    </Link>

                    <Link
                      target="_blank"
                      href={`${process.env.NEXT_PUBLIC_SCHEME}${funnel.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${clickedPage?.pathName}`}
                      className="group flex items-center justify-start p-2 gap-2 hover:text-primary transition-colors duration-200"
                    >
                      <ExternalLink size={15} />
                      <div className="w-64 overflow-hidden overflow-ellipsis ">
                        {process.env.NEXT_PUBLIC_SCHEME}
                        {funnel.subDomainName}.{process.env.NEXT_PUBLIC_DOMAIN}/
                        {clickedPage?.pathName}
                      </div>
                    </Link>
                  </div>

                  <CreateFunnelPage
                    subaccountId={subaccountId}
                    defaultData={clickedPage}
                    funnelId={funnelId}
                    order={clickedPage?.order || 0}
                  />
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="h-[600px] flex items-center justify-center text-muted-foreground">
              Create a page to view page settings.
            </div>
          )}
        </aside>
      </div>
    </AlertDialog>
  )
}

export default FunnelSteps
