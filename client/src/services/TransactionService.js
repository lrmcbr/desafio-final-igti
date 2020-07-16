import http from '../http-common';

const getAll = (data) => {
  return http.get('/transaction', { params: data });
};

const get = (id) => {
  return http.get(`/transaction/${id}`);
};

const create = (data) => {
  return http.post('/transaction', data);
};

const update = (id, data) => {
  return http.put(`/transaction/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/transaction/${id}`);
};

const removeAll = () => {
  return http.delete(`/transaction`);
};

const findByName = (name) => {
  return http.get(`/transaction?name=${name}`);
};

export default {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByName,
};
