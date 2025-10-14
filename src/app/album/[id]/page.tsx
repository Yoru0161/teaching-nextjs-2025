import { getDb } from "@/lib/db";
import Link from "next/link";

function formatDuration(duration: number) {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default async function AlbumDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const db = getDb();

  const { id } = await params;
  const albumId = parseInt(id);

  if (isNaN(albumId)) {
    return <div>Invalid Album ID</div>;
  }

  const album = await db
    .selectFrom("albums")
    .innerJoin("authors", "authors.id", "albums.author_id")
    .select([
      "albums.name",
      "albums.release_date",
      "authors.name as author_name",
      "authors.id as author_id",
    ])
    .where("albums.id", "=", albumId)
    .executeTakeFirst();

  if (!album) {
    return <div>Album not found</div>;
  }

  const songs = await db
    .selectFrom("songs")
    .selectAll()
    .where("album_id", "=", albumId)
    .execute();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="text-2xl font-bold">
          {album.name} by{" "}
          <Link
            href={`/author/${album.author_id}`}
            className="text-blue-500 hover:underline"
          >
            {album.author_name}
          </Link>
        </div>
        <div className="text-gray-500">
          Released: {new Date(album.release_date).toDateString()}
        </div>

        <div className="mt-6">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song, i) => (
                <tr key={song.id}>
                  <td>{i + 1}</td>
                  <td>{song.name}</td>
                  <td>{formatDuration(song.duration)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
