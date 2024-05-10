const mysql = require("mysql");
const config = require("./config.json");

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
});
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connection to database successful!");
});
/******************
 * WARM UP ROUTES *
 ******************/

// Route: GET /search_on_platform

// // Route: GET /random_movie
// const random_movie = async function(req, res) {
//   connection.query('\
//     SELECT *\
//     FROM streaming_platform\
//     ORDER BY RAND()\
//     LIMIT 1\
//     ', (err, data) => {res.json(data[0])});
// }

// Project Route 1: GET /search_on_platform
const search_on_platform = async function (req, res) {
  let query = `
    SELECT 
      tb.tconst AS movie_id,
      tb.primaryTitle AS title, 
      tb.genres, 
      tb.startYear AS release_year, 
      tr.averageRating AS score, 
      sp.age_certification, 
      sp.description, 
      GROUP_CONCAT(sp.platform) AS available_on
    FROM title_basics AS tb
    JOIN title_ratings AS tr ON tb.tconst = tr.tconst
    LEFT JOIN streaming_platform AS sp ON tb.tconst = sp.imdb_id
  `;

  let whereClauses = [];
  let queryParams = [];

  if (req.query.title) {
    whereClauses.push("tb.primaryTitle LIKE ?");
    queryParams.push(`%${req.query.title}%`);
  }
  if (req.query.genre) {
    whereClauses.push("tb.genres LIKE ?");
    queryParams.push(`%${req.query.genre}%`);
  }
  if (req.query.release_year) {
    whereClauses.push("tb.startYear = ?");
    queryParams.push(parseInt(req.query.release_year));
  }
  if (req.query.imdb_votes) {
    whereClauses.push("tr.numVotes >= ?");
    queryParams.push(parseInt(req.query.imdb_votes));
  }
  if (req.query.score) {
    whereClauses.push("tr.averageRating >= ?");
    queryParams.push(parseFloat(req.query.score));
  }
  if (req.query.age_certifications) {
    whereClauses.push("sp.age_certification = ?");
    queryParams.push(req.query.age_certifications);
  }
  if (req.query.description) {
    whereClauses.push("sp.description LIKE ?");
    queryParams.push(`%${req.query.description}%`);
  }

  if (whereClauses.length > 0) {
    query += " WHERE " + whereClauses.join(" AND ");
  }

  query += " GROUP BY tb.tconst ORDER BY tr.averageRating DESC";

  // If no query parameters, limit to top 100 movies by rating
  if (whereClauses.length === 0) {
    query += " LIMIT 100";
  }

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error querying the database" });
    }

    // If no results are found, return an empty array instead of an empty object
    if (results.length === 0) {
      return res.json([]);
    }

    // Convert the database results to the expected output format
    const formattedResults = results.map((movie) => ({
      id: movie.movie_id,
      title: movie.title,
      genre: movie.genres.split(",").map((genre) => genre.trim()), // assuming genres are comma-separated
      release_year: movie.release_year,
      score: movie.score,
      age_certifications: movie.age_certification,
      description: movie.description,
      available_on: movie.available_on, // assuming platforms are comma-separated
    }));

    res.json(formattedResults);
  });
};

// Project Route #3: GET /financial_details
const financial_details = async function (req, res) {
  let query = `
    SELECT 
      tb.tconst as movie_id,
      tb.primaryTitle as title,
      tb.genres as genre,
      tb.startYear as release_year,
      tr.averageRating as score,
      imr.budget_x,
      imr.revenue,
      imr.country,
      (imr.revenue - imr.budget_x) as profit
    FROM title_basics AS tb
    INNER JOIN title_ratings AS tr ON tb.tconst = tr.tconst
    INNER JOIN imdb_movies_rev AS imr ON tb.originalTitle = imr.orig_title
    LEFT JOIN name_basics AS nb ON tb.tconst = nb.knownForTitles
  `;

  let whereClauses = [];
  let queryParams = [];

  if (req.query.title) {
    whereClauses.push("tb.primaryTitle LIKE ?");
    queryParams.push(`%${req.query.title}%`);
  }
  if (req.query.genre) {
    whereClauses.push("tb.genres LIKE ?");
    queryParams.push(`%${req.query.genre}%`);
  }
  if (req.query.name) {
    whereClauses.push("nb.primaryName LIKE ?");
    queryParams.push(`%${req.query.name}%`);
  }
  if (req.query.country) {
    whereClauses.push("imr.country = ?");
    queryParams.push(req.query.country);
  }
  if (whereClauses.length > 0) {
    query += " WHERE " + whereClauses.join(" AND ");
    query += " ORDER BY profit DESC";
  } else {
    query += " ORDER BY profit DESC LIMIT 25";
  }

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error querying the database" });
    }

    if (results.length === 0) {
      return res.json([]);
    }

    const formattedResults = results.map((movie) => ({
      id: movie.movie_id,
      title: movie.title,
      genre: movie.genre.split(",").map((genre) => genre.trim()),
      release_year: movie.release_year,
      score: movie.score,
      budget_x: movie.budget_x,
      revenue: movie.revenue,
      country: movie.country,
      profit: movie.profit,
    }));

    res.json(formattedResults);
  });
};

// Project Route #4: GET /by_age_restriction
const by_age_restriction = async function (req, res) {
  let query = `
    SELECT 
      tb.tconst AS movie_id,
      tb.primaryTitle AS title, 
      tb.startYear AS release_year, 
      tr.averageRating AS rating, 
      GROUP_CONCAT(DISTINCT sp.platform ORDER BY sp.platform) AS streaming_platforms,
      sp.age_certification
    FROM title_basics AS tb
    JOIN title_ratings AS tr ON tb.tconst = tr.tconst
    JOIN streaming_platform AS sp ON tb.tconst = sp.imdb_id
  `;

  let whereClauses = [];
  let queryParams = [];

  // Check for age_certification and include_unrated conditions
  if (req.query.include_unrated === "true") {
    if (req.query.age_certification) {
      whereClauses.push(
        "(sp.age_certification = ? OR sp.age_certification IS NULL)"
      );
      queryParams.push(req.query.age_certification);
    } else {
      whereClauses.push("sp.age_certification IS NULL");
    }
  } else if (req.query.age_certification) {
    whereClauses.push("sp.age_certification = ?");
    queryParams.push(req.query.age_certification);
  } else {
    return res.status(400).json({
      error:
        "age_certification parameter is required unless include_unrated is set to true",
    });
  }

  // genre is optional
  if (req.query.genre) {
    whereClauses.push("tb.genres LIKE ?");
    queryParams.push(`%${req.query.genre}%`);
  }

  if (whereClauses.length > 0) {
    query += " WHERE " + whereClauses.join(" AND ");
  }

  query +=
    " GROUP BY tb.primaryTitle, tb.startYear, tr.averageRating, sp.age_certification";

  try {
    connection.query(query, queryParams, (err, results) => {
      // Check if results are empty
      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "No movies found matching the criteria" });
      }

      const formattedResults = results.map((result) => {
        return {
          id: result.movie_id,
          title: result.title,
          genres: result.genres,
          release_year: result.release_year,
          score: result.score,
          age_certification: result.age_certification,
          description: result.description,
          available_on: result.available_on.split(","),
        };
      });

      res.json(formattedResults);
    });
  } catch (error) {
    console.error("Database error occurred:", error);
    if (error.code === "ER_LOCK_WAIT_TIMEOUT") {
      res
        .status(503)
        .json({ error: "Service unavailable. Please try again later." });
    } else if (error.code === "ER_DUP_ENTRY") {
      res.status(409).json({ error: "Conflict. Duplicate entry found." });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// Project Route 5: GET /streaming_guide
// Define the streaming_guide route handler function
const streaming_guide = async function (req, res) {
  // SQL query string
  let query = `
  SELECT 
    DISTINCT tr.tconst as movie_id,
    sp.platform,
    COUNT(CASE WHEN tr.averageRating >= ? THEN 1 END) AS movie_count_above_min_score,
    SUM(CASE WHEN tr.averageRating >= ? THEN tr.numVotes END) AS total_votes
FROM 
  streaming_platform sp
JOIN 
  title_ratings tr ON sp.imdb_id = tr.tconst
JOIN 
  title_basics tb ON tr.tconst = tb.tconst
WHERE 
  tb.genres LIKE ?
GROUP BY 
  sp.platform;
  `;

  // Parameters for the query
  const queryParams = [
    parseFloat(req.query.minimum_score), // Convert to float
    parseFloat(req.query.minimum_score), // Convert to float
    `%${req.query.genre}%`, // Add wildcards to match genre
  ];

  // Execute the query
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error querying the database" });
    }

    // Send the results as JSON response
    res.json(results.map((result) => ({ id: result.movie_id, ...result })));
  });
};

// Project Route #6: /random_by_runtime (COMPLEX run time)
// NOTE: Because ORDER BY RAND() in SQL takes too long,
// the sql query will return the entire joined table and the random selection will be done in the server
// WARNING: This query may take a long time to run
const random_by_runtime = async function (req, res) {
  let query = `
    SELECT
      tb.tconst AS movie_id,
      imr.orig_title AS title,
      imr.date_x AS release_year,
      imr.country AS country,
      tb.runtimeMinutes AS runtime,
      tb.genres AS genre
    FROM
      imdb_movies_rev imr
    JOIN
      title_basics tb ON imr.orig_title = tb.originalTitle
    WHERE
      tb.titleType = 'movie' 
      AND tb.runtimeMinutes <= ${req.query.runtime_limit} 
  `;

  let whereClauses = [];
  let queryParams = [];
  connection.query(query, queryParams, (err, results) => {
    // Handle the query results here
    if (err) {
      // Handle the error
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      // Check if there are any results
      if (results.length === 0) {
        res.status(404).json({ error: "No movies found" });
      } else {
        // Pick a random row from the results
        const randomIndex = Math.floor(Math.random() * results.length);
        const randomMovie = results[randomIndex];
        // Return the random movie
        res.json({
          id: randomMovie.movie_id,
          title: randomMovie.title,
          release_year: randomMovie.release_year,
          country: randomMovie.country,
          runtime: randomMovie.runtime,
          genre: randomMovie.genre
        });
      }
    }
  });
};

// Project Route 7: GET /by_revenue_range
// Define the by_revenue_range route handler function
const by_revenue_range = async function (req, res) {
  // SQL query string
  let query = `
  SELECT 
    tb.tconst AS movie_id,
    tb.primaryTitle AS title,
    GROUP_CONCAT(DISTINCT tb.genres SEPARATOR ', ') AS genres,
    imr.revenue AS revenue,
    ROUND(AVG(tr.averageRating), 2) AS average_rating,
    imr.country AS production_country,
    CASE 
      WHEN (SELECT COUNT(*) FROM streaming_platform sp WHERE sp.imdb_id = tb.tconst) > 0 
          THEN (SELECT GROUP_CONCAT(DISTINCT platform SEPARATOR ', ') FROM streaming_platform sp WHERE sp.imdb_id = tb.tconst)
      ELSE NULL 
    END AS suggested_streaming_platforms
  FROM 
    title_basics tb
  JOIN 
    imdb_movies_rev imr ON tb.originalTitle = imr.orig_title
  LEFT JOIN 
    title_ratings tr ON tb.tconst = tr.tconst
  WHERE 
    imr.revenue BETWEEN ? AND ? -- Replace ? placeholders with input parameters
  GROUP BY 
    tb.primaryTitle, imr.revenue, imr.country
  ORDER BY
    imr.revenue DESC, average_rating DESC;
  `;

  // Parameters for the query
  const queryParams = [
    parseFloat(req.query.min_revenue), // Convert to float
    parseFloat(req.query.max_revenue), // Convert to float
  ];

  // Execute the query
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error querying the database" });
    }

    // Send the results as JSON response
    const formattedResults = results.map((result) => {
      return {
      id: result.movie_id,
      title: result.title,
      genre: result.genres,
      revenue: result.revenue,
      averageRating: result.average_rating,
      productionCountry: result.production_country,
      suggestedStreamingPlatforms: result.suggested_streaming_platforms,
      };
    });
    res.json(formattedResults);
  });
};

// Project Route #8 (Complex): /top_by_genre
const top_by_genre = async function (req, res) {
  let query = `
  SELECT
    tb.tconst AS movie_id,
    tb.primaryTitle AS Title,
    IFNULL(sp.production_countries, 'Unknown') AS Country,
    tb.startYear AS Released_Year,
    tr.averageRating AS Score,
    IFNULL(GROUP_CONCAT(DISTINCT sp.platform SEPARATOR ', '), 'Unknown') AS Streaming_Platform
  FROM
    title_basics tb
  JOIN
    title_ratings tr ON tb.tconst = tr.tconst
  LEFT JOIN
    (SELECT imdb_id, platform, production_countries FROM streaming_platform WHERE imdb_id IN 
      (SELECT tconst FROM title_basics WHERE genres LIKE ?)) sp ON tb.tconst = sp.imdb_id
  GROUP BY
    tb.primaryTitle, tr.averageRating
  ORDER BY
    tr.averageRating DESC
  LIMIT 10;
  `;

  // Using parameterized query to prevent SQL injection
  connection.query(query, [`%${req.query.genre}%`], (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res
        .status(500)
        .json({ error: "Internal server error", details: err.message });
    }
    if (results.length === 0) {
      // Handle case where no results are found
      return res
        .status(404)
        .json({ message: "No movies found for the specified genre" });
    }
    // Sending back the results as JSON
    res.json(
      results.map((result) => ({
        id: result.movie_id,
        title: result.Title,
        country: result.Country.split(",").map((c) => c.trim()), // Assuming countries are comma-separated
        releasedYear: result.Released_Year,
        score: result.Score,
        streamingPlatforms: result.Streaming_Platform.split(",").map((p) =>
          p.trim()
        ), // Assuming platforms are comma-separated
      }))
    );
  });
};

// Project Route #9: GET /search_by_name
const search_by_name = async function (req, res) {
  let query = `
    SELECT
      movie_id,
      movie_title,
      release_year,
      rating,
      streaming_platforms,
      revenue,
      cost,
      sp.description
    FROM (
      SELECT
          tb.tconst AS movie_id,
          tb.primaryTitle AS movie_title,
          tb.startYear AS release_year,
          tr.averageRating AS rating,
          GROUP_CONCAT(DISTINCT sp.platform SEPARATOR ', ') AS streaming_platforms,
          imr.revenue AS revenue,
          imr.budget_x AS cost,
          sp.description,
          ROW_NUMBER() OVER (PARTITION BY tb.primaryTitle ORDER BY tb.startYear DESC) AS rn
      FROM
          title_basics tb
      LEFT JOIN
          title_ratings tr ON tb.tconst = tr.tconst
      LEFT JOIN
          streaming_platform sp ON tb.tconst = sp.imdb_id
      LEFT JOIN
          imdb_movies_rev imr ON tb.originalTitle = imr.orig_title
      WHERE
          tb.primaryTitle LIKE ?
      GROUP BY
          tb.tconst, tb.primaryTitle, tb.startYear, tr.averageRating, imr.revenue, imr.budget_x, sp.description
    ) AS subquery
    WHERE
      (streaming_platforms IS NOT NULL OR rn = 1)
    ORDER BY
      release_year DESC;
  `;

  connection.query(query, [`%${req.query.movie_title}%`], (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res
        .status(500)
        .json({ error: "Internal server error", details: err.message });
    }
    if (results.length === 0) {
      // Handle case where no results are found
      return res
        .status(404)
        .json({ message: "No movies found for the specified genre" });
    }
    res.json(
      results.map((result) => ({
        movie_id: result.movie_id,
        movie_title: result.movie_title,
        release_year: result.release_year,
        rating: result.rating,
        streaming_platforms: result.streaming_platforms,
        revenue: result.revenue,
        cost: result.cost,
        description: result.description,
      }))
    );
  });
};

// Project Route 10: GET //top_by_financials
// Define the top_by_financials route handler function
const top_by_financials = async function (req, res) {
  // Extract query parameters from the request
  const page = req.query.page || 1; // Default page is 1
  const pageSize = req.query.page_size || 25; // Default page size is 25

  // Calculate the offset for pagination
  const offset = (page - 1) * pageSize;

  // SQL query string
  const query = `
    SELECT DISTINCT
        names AS movie_title,
        score,
        budget_x AS budget,
        revenue,
        country AS production_country,
        (revenue - budget_x) AS profit
    FROM imdb_movies_rev
    ORDER BY profit DESC, score DESC
    LIMIT ? OFFSET ?;
  `;

  // Parameters for the query
  const queryParams = [parseInt(pageSize), parseInt(offset)];

  // Execute the query
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error querying the database" });
    }

    // Send the results as JSON response
    res.json(results);
  });
};

// Project Route 11: GET /movie/:movie_id
// Define the movie route handler function
const movie = async function (req, res) {
  // Extract movie_id from the request parameters
  const movie_id = req.params.movie_id;

  // SQL query string
  const query = `
    SELECT 
      tconst AS movieID,
      primaryTitle,
      titleType AS Type,
      CASE 
        WHEN isAdult = 0 THEN 'No'
        ELSE 'Yes'
      END AS isAdult,
      startYear,
      runtimeMinutes,
      GROUP_CONCAT(genres SEPARATOR ', ') AS genres
    FROM 
      title_basics
    WHERE 
      tconst = ?
  `;

  // Execute the query
  connection.query(query, [movie_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error querying the database" });
    }

    // If no data found for the given movie_id, return an empty object
    if (results.length === 0) {
      return res.json({});
    }

    // Send the first result as JSON response
    res.json(results[0]);
  });
};

// Project Route 12: GET /platform
const platform = async function (req, res) {
  const platform = req.params.platform;

  connection.query(
    `
  SELECT * 
  FROM platform_information 
  WHERE platform = ?
  `,
    [platform],
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data[0]);
      }
    }
  );
};

module.exports = {
  search_on_platform,
  financial_details,
  by_age_restriction,
  random_by_runtime,
  top_by_genre,
  search_by_name,
  streaming_guide,
  by_revenue_range,
  top_by_financials,
  movie,
  platform,
};
