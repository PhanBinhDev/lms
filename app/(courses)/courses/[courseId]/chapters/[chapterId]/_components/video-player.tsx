'use client'

import MuxPlayer from '@mux/mux-player-react'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Loader2, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
interface VideoPlayerProps {
  chapterId: string
  title: string
  courseId: string
  nextChapterId: string
  playbackId: string
  isLocked: boolean
  completedOnEnd: boolean
}

export const VideoPlayer = ({
  chapterId,
  title,
  courseId,
  nextChapterId,
  playbackId,
  isLocked,
  completedOnEnd
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false)

  return (
    <div className='aspect-video relative'>
      {!isReady && !isLocked ? (
        <div className='flex items-center justify-center bg-slate-800 absolute inset-0'>
          <Loader2 className='size-8 animate-spin text-secondary' />
        </div>
      ) : (
        <div className='flex flex-col gap-y-0 items-center justify-center bg-slate-800 absolute inset-0 text-secondary'>
          <Lock className='size-8' />
          <p className='text-sm'>This chapter is locked</p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          title={title}
          playbackId={playbackId}
          className={cn('rounded-md', !isReady && 'hidden')}
          onCanPlay={() => setIsReady(true)}
          onEnded={(e) => {
            console.log({ e })
          }}
          autoPlay
        />
      )}
    </div>
  )
}
