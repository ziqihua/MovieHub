const express = require("express");
const cors = require("cors");
const config = require("./config");
const routes = require("./routes");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
// project
// app.get('/random_movie', routes.random_movie);
app.get("/search_on_platform", routes.search_on_platform);
app.get("/financial_details", routes.financial_details);
app.get("/by_age_restriction", routes.by_age_restriction);
app.get("/random_by_runtime", routes.random_by_runtime);
app.get("/top_by_genre", routes.top_by_genre);
app.get("/search_by_name", routes.search_by_name);

app.get("/streaming_guide", routes.streaming_guide);
app.get("/by_revenue_range", routes.by_revenue_range);
app.get("/top_by_financials", routes.top_by_financials);
app.get("/movie/:movie_id", routes.movie);
app.get("/platform/:platform", routes.platform);

app.listen(config.server_port, () => {
  console.log(
    `Server running at http://${config.server_host}:${config.server_port}/`
  );
});

module.exports = app;
