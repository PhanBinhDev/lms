import { getChapter } from '@/actions/get-chapter'
import { Banner } from '@/components/banner'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { VideoPlayer } from './_components/video-player'
import { CourseEnrollButton } from './_components/course-enroll-button'
import { Separator } from '@radix-ui/react-separator'
import { Preview } from '@/components/preview'

const ChapterIdPage = async ({
  params
}: {
  params: {
    chapterId: string
    courseId: string
  }
}) => {
  const { userId } = auth()
  const { chapterId, courseId } = params
  if (!userId) return redirect('/')

  const {
    chapter,
    course,
    muxData,
    nextChapter,
    purchase,
    userProgress,
    attachments
  } = await getChapter({
    chapterId,
    courseId,
    userId
  })

  if (!chapter || !course) {
    return redirect('/')
  }

  const isLocked = !chapter.isFree && !purchase
  const completedOnEnd = !!purchase && !userProgress?.isCompleted

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          variant={'success'}
          label='You already completed this chapter'
        />
      )}

      {isLocked && (
        <Banner
          variant={'warning'}
          label='This chapter is locked and you need to purchase the course to access it'
        />
      )}
      <div className='flex flex-col max-w-4xl mx-auto pb-20'>
        <div className='p-4'>
          <VideoPlayer
            chapterId={chapterId}
            title={chapter.title!}
            courseId={courseId}
            nextChapterId={nextChapter?.id!}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completedOnEnd={completedOnEnd}
          />
        </div>
        <div>
          <div className='p-4 flex flex-col lg:flex-row items-center justify-between'>
            <h2 className='text-2xl font-semibold mb-2'>{chapter.title}</h2>
            {purchase ? (
              <div>{/* TODO: Course ProgressButton */}</div>
            ) : (
              <CourseEnrollButton courseId={courseId} price={course.price!} />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description!} />
          </div>
          {!!attachments.length && (
            <>
              <Separator />
              <div className='p-4'>
                {attachments.map((attachment) => (
                  <a
                    className='flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline'
                    href={attachment.url}
                    target='_blank'
                    key={attachment.id}>
                    <p>{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChapterIdPage
