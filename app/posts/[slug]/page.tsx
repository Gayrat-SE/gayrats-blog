import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const prisma = new PrismaClient();

async function getPost(slug: string) {
    const post = await prisma.post.findUnique({
        where: { slug },
    });

    if (!post || !post.published) {
        notFound();
    }

    return post;
}

export default async function BlogPost({
    params,
}: {
    params: { slug: string };
}) {
    const post = await getPost(params.slug);

    return (
        <div className="min-h-screen bg-gray-100">
            <main className="max-w-4xl mx-auto py-8 px-4">
                <article className="bg-white rounded-lg shadow-md p-8">
                    <header className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
                        <div className="text-gray-600">
                            {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                    </header>

                    <div className="prose max-w-none">
                        {post.content.split('\n').map((paragraph: string, index: number) => (
                            <p key={index} className="mb-4">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </article>

                <div className="mt-8">
                    <Link
                        href="/"
                        className="text-blue-500 hover:text-blue-700"
                    >
                        ← Back to all posts
                    </Link>
                </div>
            </main>
        </div>
    );
} 