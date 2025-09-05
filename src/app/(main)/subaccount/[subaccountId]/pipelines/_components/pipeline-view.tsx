'use client'
import LaneForm from '@/components/forms/lane-form'
import CustomModal from '@/components/global/custom-modal'
import { Button } from '@/components/ui/button'
import {
  LaneDetail,
  PipelineDetailsWithLanesCardsTagsTickets,
  TicketAndTags,
} from '@/lib/types'
import { useModal } from '@/providers/modal-provider'
import { Lane, Ticket } from '@prisma/client'
import { Flag, Plus, Bot, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd'
import PipelineLane from './pipeline-lane'

type Props = {
  lanes: LaneDetail[]
  pipelineId: string
  subaccountId: string
  pipelineDetails: PipelineDetailsWithLanesCardsTagsTickets
  updateLanesOrder: (lanes: Lane[]) => Promise<void>
  updateTicketsOrder: (tickets: Ticket[]) => Promise<void>
}

const PipelineView = ({
  lanes,
  pipelineDetails,
  pipelineId,
  subaccountId,
  updateLanesOrder,
  updateTicketsOrder,
}: Props) => {
  const { setOpen } = useModal()
  const router = useRouter()
  const [allLanes, setAllLanes] = useState<LaneDetail[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setAllLanes(lanes)
  }, [lanes])

  const ticketsFromAllLanes: TicketAndTags[] = []
  lanes.forEach((item) => {
    item.Tickets.forEach((i) => {
      ticketsFromAllLanes.push(i)
    })
  })
  const [allTickets, setAllTickets] = useState(ticketsFromAllLanes)

  const handleAddLane = () => {
    setOpen(
      <CustomModal
        title=" Create A Lane"
        subheading="Lanes allow you to group tickets"
      >
        <LaneForm pipelineId={pipelineId} />
      </CustomModal>
    )
  }

  const handleAIGeneration = () => {
    setOpen(
      <CustomModal
        title="AI Agent - Generate Components & Pages"
        subheading="Use AI to automatically generate components, pages, and complete workflows"
      >
        <div className="space-y-6 p-4">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">AI Component & Page Generator</h3>
              <p className="text-sm text-gray-600">Generate complete pages and components with AI assistance</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-3 p-6"
              onClick={() => {
                router.push(`/subaccount/${subaccountId}/funnels`)
              }}
            >
              <Sparkles className="h-8 w-8 text-blue-500" />
              <div>
                <div className="font-medium">Generate Components</div>
                <div className="text-xs text-gray-500 mt-1">Create custom UI components with AI</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-3 p-6"
              onClick={() => {
                router.push(`/subaccount/${subaccountId}/funnels`)
              }}
            >
              <Bot className="h-8 w-8 text-purple-500" />
              <div>
                <div className="font-medium">Generate Full Pages</div>
                <div className="text-xs text-gray-500 mt-1">Build complete pages with AI</div>
              </div>
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            Multi-platform code generation: React • React Native • Python
          </div>
        </div>
      </CustomModal>
    )
  }

  const onDragEnd = (dropResult: DropResult) => {
    console.log(dropResult)
    const { destination, source, type } = dropResult
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return
    }

    switch (type) {
      case 'lane': {
        const newLanes = [...allLanes]
          .toSpliced(source.index, 1)
          .toSpliced(destination.index, 0, allLanes[source.index])
          .map((lane, idx) => {
            return { ...lane, order: idx }
          })

        setAllLanes(newLanes)
        updateLanesOrder(newLanes)
      }

      case 'ticket': {
        let newLanes = [...allLanes]
        const originLane = newLanes.find(
          (lane) => lane.id === source.droppableId
        )
        const destinationLane = newLanes.find(
          (lane) => lane.id === destination.droppableId
        )

        if (!originLane || !destinationLane) {
          return
        }

        if (source.droppableId === destination.droppableId) {
          const newOrderedTickets = [...originLane.Tickets]
            .toSpliced(source.index, 1)
            .toSpliced(destination.index, 0, originLane.Tickets[source.index])
            .map((item, idx) => {
              return { ...item, order: idx }
            })
          originLane.Tickets = newOrderedTickets
          setAllLanes(newLanes)
          updateTicketsOrder(newOrderedTickets)
          router.refresh()
        } else {
          const [currentTicket] = originLane.Tickets.splice(source.index, 1)

          originLane.Tickets.forEach((ticket, idx) => {
            ticket.order = idx
          })

          destinationLane.Tickets.splice(destination.index, 0, {
            ...currentTicket,
            laneId: destination.droppableId,
          })

          destinationLane.Tickets.forEach((ticket, idx) => {
            ticket.order = idx
          })
          setAllLanes(newLanes)
          updateTicketsOrder([
            ...destinationLane.Tickets,
            ...originLane.Tickets,
          ])
          router.refresh()
        }
      }
    }
  }

  if (!mounted) {
    return (
      <div className="bg-white/60 dark:bg-background/60 rounded-xl p-4 use-automation-zoom-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">{pipelineDetails?.name}</h1>
          <Button
            className="flex items-center gap-4"
            onClick={handleAddLane}
          >
            <Plus size={15} />
            Create Lane
          </Button>
        </div>
        <div className="flex item-center gap-x-2 overflow-scroll">
          <div className="flex mt-4">
            {allLanes.map((lane, index) => (
              <div key={lane.id} className="min-w-[300px] max-w-[300px] p-4 bg-slate-200/30 dark:bg-background/40 mr-4 rounded-lg">
                <div className="p-4">Loading...</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="bg-white/60 dark:bg-background/60 rounded-xl p-4 use-automation-zoom-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">{pipelineDetails?.name}</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
              onClick={handleAIGeneration}
            >
              <Bot size={15} />
              AI Agent
            </Button>
            <Button
              className="flex items-center gap-4"
              onClick={handleAddLane}
            >
              <Plus size={15} />
              Create Lane
            </Button>
          </div>
        </div>
        <Droppable
          droppableId="lanes"
          type="lane"
          direction="horizontal"
          key="lanes"
        >
          {(provided) => (
            <div
              className="flex item-center gap-x-2 overflow-scroll"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className="flex mt-4">
                {allLanes.map((lane, index) => (
                  <PipelineLane
                    allTickets={allTickets}
                    setAllTickets={setAllTickets}
                    subaccountId={subaccountId}
                    pipelineId={pipelineId}
                    tickets={lane.Tickets}
                    laneDetails={lane}
                    index={index}
                    key={lane.id}
                  />
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
        {allLanes.length == 0 && (
          <div className="flex items-center justify-center w-full flex-col">
            <div className="opacity-100">
              <Flag
                width="100%"
                height="100%"
                className="text-muted-foreground"
              />
            </div>
          </div>
        )}
      </div>
    </DragDropContext>
  )
}

export default PipelineView
