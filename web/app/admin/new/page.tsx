import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import AdminLogout from "@/components/AdminLogout"
import PostForm from "@/components/PostForm"

export default function NewPostPage() {
  return (
    <main className="min-h-screen bg-page pt-8 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 font-mono text-sm text-[#8b949e] hover:text-accent transition-colors"
          >
            <ArrowLeft size={14} />
            cd ~/admin
          </Link>
          <AdminLogout />
        </div>

        <div className="font-mono text-[var(--green-dim)] text-sm mb-2">$ vim new_post.md</div>
        <h1 className="text-2xl font-mono font-bold text-white mb-8">
          <span className="text-accent">//</span> nuevo post
        </h1>

        <PostForm mode="create" />
      </div>
    </main>
  )
}
