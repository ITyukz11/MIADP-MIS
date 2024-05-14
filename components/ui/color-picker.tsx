'use client'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils' 
import { Paintbrush } from 'lucide-react'
import { useMemo } from 'react'

export function ColorPicker({
    background,
    setBackground,
    className,
  }: {
    background: string
    setBackground: (background: string) => void
    className?: string
  }) {
    const solids = [
        "#F5222D",
        "#FA8C16",
        "#52C41A",
        "#13A8A8",
        "#1677FF",
        "#2F54EB",
        "#722ED1",
        "#EB2F96",
    ]

  
    const defaultTab = useMemo(() => {
      if (background.includes('url')) return 'image'
      if (background.includes('gradient')) return 'gradient'
      return 'solid'
    }, [background])
  
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-[220px] justify-start text-left font-normal',
              !background && 'text-muted-foreground',
              className
            )}
          >
            <div className="w-full flex items-center gap-2">
              {background ? (
                <div
                  className="h-4 w-4 rounded !bg-center !bg-cover transition-all"
                  style={{ background }}
                ></div>
              ) : (
                <Paintbrush className="h-4 w-4" />
              )}
              <div className="truncate flex-1">
                {background ? background : 'Pick a color'}
              </div>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <Tabs defaultValue={defaultTab} className="w-full">
  
            <TabsContent value="solid" className="flex flex-wrap gap-1 mt-0">
              {solids.map((s) => (
                <div
                  key={s}
                  style={{ background: s }}
                  className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                  onClick={() => setBackground(s)}
                />
              ))}
            </TabsContent>

  
  
          </Tabs>

        </PopoverContent>
      </Popover>
    )
  }
  
