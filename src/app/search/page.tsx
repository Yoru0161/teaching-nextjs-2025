import { getDb } from '@/lib/db';

export default async function Search({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const db = getDb();
  const id = searchParams.id;

  if (!id || Array.isArray(id)) {
    return <div>Invalid author id</div>;
  }

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
    <div className="p-4">
      <h1 className="text-2xl font-bold">{author.name}</h1>
      <p className="mb-4">{author.bio}</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Albums</h2>
      <ul className="list-disc pl-5">
        {albums.map((album) => (
          <li key={album.id}>
            {album.name} ({album.release_date})
          </li>
        ))}
      </ul>
    </div>
  );
}
