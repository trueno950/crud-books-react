import { ParametersFilters } from "@/interfaces";
import { getEnvironment } from "@/utils";

import apis from "./index";
import { CreateBook } from "@/interfaces/Book";

const { VITE_API_BASE_URL } = getEnvironment();

export const apiCreateBook = (requestBody: CreateBook) => {
  return apis.post(`${VITE_API_BASE_URL}/books`, requestBody, {
    headers: { "content-type": "application/json" },
  });
};

export const apiGetBooks = (params?: ParametersFilters) => {
  return apis.get(`${VITE_API_BASE_URL}/books`, {
    headers: { "content-type": "application/json" },
    params,
  });
};

export const apiGetBook = (bookId: string) => {
  return apis.get(`${VITE_API_BASE_URL}/books/${bookId}`, {
    headers: { "content-type": "application/json" },
  });
};

export const apiUpdateBook = (bookId: string, requestBody: CreateBook) => {
  return apis.put(`${VITE_API_BASE_URL}/books/${bookId}`, requestBody, {
    headers: { "content-type": "application/json" },
  });
};

export const apiDeleteBook = (bookId: string) => {
  return apis.delete(`${VITE_API_BASE_URL}/books/${bookId}`, {
    headers: { "content-type": "application/json" },
  });
};
