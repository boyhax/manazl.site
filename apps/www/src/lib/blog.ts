import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { cache } from 'react'
import { BlogPost } from '@/app/blog/page'

const postsDirectory = path.join(process.cwd(), 'src/content/blog')

// Cache the getAllPosts function
export const getAllPosts = cache(async () => {
  const files = fs.readdirSync(postsDirectory)
  const posts = files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '')
      const { data, content } = matter(fs.readFileSync(path.join(postsDirectory, file), 'utf8'))

      return {
        slug,
        readingTime: readingTime(content).text,
        ...data as any,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
})

// Cache the getPost function
export const getPost = cache(async (slug: string) => {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      content,
      readingTime: readingTime(content).text,
      ...data as BlogPost,
    }
  } catch (error) {
    return null
  }
})