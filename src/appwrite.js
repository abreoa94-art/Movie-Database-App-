import { Client, Databases, Query, ID } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;

// ✅ You don’t need ENDPOINT_ID unless you have a special reason for it
const ENDPOINT = "https://nyc.cloud.appwrite.io/v1";

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);

const database = new Databases(client);

// ✅ Update or create a search term document
export const updateSearchCount = async (searchTerm, movie) => {
    try {
        const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [
            Query.equal("searchTerm", searchTerm),
        ]);

        // ✅ Safely check the result before accessing .length
        if (result && Array.isArray(result.documents) && result.documents.length > 0) {
            const doc = result.documents[0];
            await database.updateDocument(DATABASE_ID, TABLE_ID, doc.$id, {
                count: (doc.count || 0) + 1,
            });
        } else {
            await database.createDocument(DATABASE_ID, TABLE_ID, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: movie?.id || "N/A",
                poster_url: movie?.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "",
            });
        }
    } catch (err) {
        console.error("Appwrite updateSearchCount error:", err);
    }
};

// ✅ Retrieve trending movies (most searched)
export const getTrendingMovies = async () => {
    try {
        const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [
            Query.limit(5),
            Query.orderDesc("count"),
        ]);

        // ✅ Ensure result.documents exists before returning
        if (result && Array.isArray(result.documents)) {
            return result.documents;
        } else {
            console.warn("getTrendingMovies returned invalid data:", result);
            return [];
        }
    } catch (err) {
        console.error("Appwrite getTrendingMovies error:", err);
        return [];
    }
};
