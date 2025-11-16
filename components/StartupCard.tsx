import React from 'react'
import { formatDate } from '@/lib/utils'
import { EyeIcon} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import { Author, Startup } from '@/sanity/types'

export type StartupTypeCard = Omit<Startup,"author"> & {author?:Author}

const StartupCard = ({post}:{post:StartupTypeCard}) => {
    const {_createdAt,author,image,_id,views,category,title,description} = post
  return (
    <li className='startup-card group'>
        <div className='flex-between'>
            <p className='stratup-card_date'>{formatDate(_createdAt)}</p>
            <div className='flex gap-1.5'>
                <EyeIcon className='size-6 text-primary' />
                <span className='size-16-medium'>{views}</span>
            </div>
        </div>
        <div className='flex-between mt-5 gap-5'>
            <div className='flex-1'>
                <Link href={`/user/${author?._id}`}>
                <p className='text-16-medium line-clamp-1'>{author?.name}</p>
                </Link>
                <Link href={`/user/${_id}`}>
                <h3 className='text-26-semibold line-clamp-1'>{title}</h3>
                </Link>
            </div>
            <Link href={`/user/${author?._id}`}>
             <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={author?.image!}
                        alt={author?.name!}
                        fill={true} /* 2. Tells Image to fill its relative parent */
                         /* 3. 'object-cover' crops the image to fit the circle */
                      />
                    </div>
            {/* <Image src={author?.image!} alt={author?.name!} 
            width={48} height={48} className='rounded-full' /> */}
            </Link>
        </div>
        <Link href={`/startup/${_id}`}>
            <p className='startup-card_desc'> {description}</p>
            <img src={image} alt='startup_image' className='startup-card_img'/>
        </Link>
        <div className='flex-between gap-3 mt-5'>
            <Link href={`/?query=${category?.toLowerCase()}`}>
            <p className='text-16-medium'>{category}</p>
            </Link>
            <Button  className='startup-card_btn' asChild>
                <Link href={`/startup/${_id}`}>
                Details
                </Link>
            </Button>
        </div>
    </li>
  )
}

export default StartupCard
