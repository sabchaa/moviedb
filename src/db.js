import knex from "knex"
import knexfile from "../knexfile.js"

const env = process.env.NODE_ENV ?? "development"

export const db = knex(knexfile[env])

export const getAllMovies = async () => {
    const query = db("movies").select("*")
  
    const movies = await query
  
    return movies
}