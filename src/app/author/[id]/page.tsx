import { getDb } from "@/lib/db";
import Link from "next/link";

export default async function AuthorDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const db = getDb();
  const { id } = await params;
  const authorId = parseInt(id);

  if (isNaN(authorId)) {
    return <div>Invalid author id</div>;
  }

  const author = await db
    .selectFrom("authors")
    .select(["id", "name", "bio"])
    .where("id", "=", authorId)
    .executeTakeFirst();

  if (!author) {
    return <div>Author not found</div>;
  }

  const albums = await db
    .selectFrom("albums")
    .select(["id", "name", "release_date"])
    .where("author_id", "=", authorId)
    .execute();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">{author.name}</h1>
        <p className="max-w-lg text-gray-600">{author.bio}</p>

        <h2 className="text-2xl font-semibold mt-6">Albums</h2>
        <ul className="list-disc ml-6">
          {albums.map((album) => (
            <li key={album.id}>
              <Link
                href={`/album/${album.id}`}
                className="text-blue-500 hover:underline"
              >
                {album.name} ({new Date(album.release_date).getFullYear()})
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
