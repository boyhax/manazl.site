import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, Clock, User } from 'lucide-react'
import { getAllPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog | Manazl - Discover Oman Through Our Stories',
  description: 'Explore Oman\'s rich culture, hidden gems, and travel experiences through our curated blog posts.',
}

// Force static rendering
export const revalidate = 3600 // Revalidate every hour

// Generate static params
export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export interface BlogPost {
  title: string
  excerpt: string
  date: string
  author: string
  imageUrl: string
  tags: string[]
  slug: string
  readingTime?: string
  content?: string
}

export interface BlogMeta {
  currentPage: number
  totalPages: number
  posts: BlogPost[]
}

export default async function BlogPage() {
  // This data will be fetched at build time
  const posts = await getAllPosts()

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] mb-16">
        <Image
          src="https://images.unsplash.com/photo-1621680696874-edd80ce57b72?q=80&w=1591&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Blog Hero"
          fill
          priority
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center space-y-4 max-w-3xl mx-auto px-4">
            <h1 className="text-5xl font-bold">Our Blog</h1>
            <p className="text-xl">
              Discover the beauty, culture, and hidden gems of Oman through our stories
            </p>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article 
              key={post.slug} 
              className="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4" />
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </time>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>{post.readingTime}</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-gray-50 px-3 py-1 rounded-full text-sm text-gray-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}