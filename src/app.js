const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(),  title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository)
});

app.use('/repositories/:id', function (request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(item => item.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found'});
  }

  request.repositoryIndex = repositoryIndex;

  next();
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = repositories[request.repositoryIndex];

  repositories[request.repositoryIndex] = {
    ...repository,
    title,
    url,
    techs,
  }

  return response.json(repositories[request.repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  repositories.splice(request.repositoryIndex, 1);

  return response.status(204).json({ message: 'Repository deleted'});
});

app.post("/repositories/:id/like", (request, response) => {
  repositories[request.repositoryIndex].likes += 1;

  return response.json(repositories[request.repositoryIndex]);
});

module.exports = app;
