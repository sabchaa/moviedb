import { db } from "./db.js"

export const updateMovieRating = async (knex, movieId) => {
    const reviews = await db('reviews')
        .select('rating')
        .where('movie_id', movieId);

    const totalReviews = reviews.length;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

    const roundedRating = Number(averageRating.toFixed(1));

    await db('movies')
        .where('id', movieId)
        .update({ rating: roundedRating });
};