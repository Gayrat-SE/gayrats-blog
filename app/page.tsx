import { PrismaClient, Post } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

async function getPosts() {
    const posts = await prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
    });
    return posts;
}

export default async function Home() {
    const posts = await getPosts();

    return (
        <div className="min-h-screen bg-gray-100">
            <main className="max-w-4xl mx-auto py-8 px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
                    <Link
                        href="/admin"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Admin Dashboard
                    </Link>
                </div>

                <div className="space-y-6">
                    {posts.map((post: Post) => (
                        <article
                            key={post.id}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                        >
                            <Link href={`/posts/${post.slug}`}>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                                    {post.title}
                                </h2>
                                <div className="text-gray-600">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </div>
                            </Link>
                        </article>
                    ))}

                    {posts.length === 0 && (
                        <p className="text-gray-600 text-center py-8">
                            No blog posts published yet.
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
} 