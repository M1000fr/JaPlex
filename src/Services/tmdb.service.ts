import Dotenv from "@/Utils/Dotenv";
import { TMDB } from "tmdb-ts";

export const tmdb = new TMDB(Dotenv.TMDB_API_KEY);
