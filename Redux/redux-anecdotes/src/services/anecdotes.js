import axios from 'axios';

const baseUrl = 'http://localhost:3001/anecdotes';

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async content => {
  const object = { content, id: (100000 * Math.random()).toFixed(0), votes: 0 };
  const response = await axios.post(baseUrl, object);
  return response.data;
};

const vote = async id => {
  const anecdote = await await axios.get(`${baseUrl}/${id}`);
  const votes = anecdote.data.votes;
  const request = axios.patch(`${baseUrl}/${id}`, { votes: votes + 1 });
  return request.then(response => response.data);
};

const methods = { getAll, create, vote };

export default methods;
