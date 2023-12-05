import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateBook, BookInterface } from "@/interfaces/Book";
import {
  apiCreateBook,
  apiDeleteBook,
  apiGetBook,
  apiGetBooks,
  apiUpdateBook,
} from "@/apis/bookApi";
import { parseErrorAxios } from "@/utils";
import { PagingInterface, ParametersFilters } from "@/interfaces";

export const thunkCreateBook = createAsyncThunk<
  BookInterface,
  { book: CreateBook }
>("book/createBook", async (props, { rejectWithValue }) => {
  try {
    const { book } = props;
    const { data } = await apiCreateBook(book);
    return data;
  } catch (err) {
    const result = parseErrorAxios(err);
    throw rejectWithValue(result);
  }
});

export const thunkGetBook = createAsyncThunk<BookInterface, { bookId: string }>(
  "book/getBook",
  async (props, { rejectWithValue }) => {
    try {
      const bookId = props.bookId;
      const { data } = await apiGetBook(bookId);
      return data;
    } catch (err) {
      const result = parseErrorAxios(err);
      throw rejectWithValue(result);
    }
  }
);

export const thunkGetBooks = createAsyncThunk<
  { books: BookInterface[]; paging: PagingInterface },
  { params: ParametersFilters }
>("book/getBooks", async (props, { rejectWithValue }) => {
  try {
    const { params } = props;
    const { data } = await apiGetBooks(params);
    return data;
  } catch (err) {
    const result = parseErrorAxios(err);
    throw rejectWithValue(result);
  }
});

export const thunkUpdateBook = createAsyncThunk<
  BookInterface,
  { book: CreateBook; bookId: string }
>("book/updateBook", async (props, { rejectWithValue }) => {
  try {
    const { book, bookId } = props;
    const { data } = await apiUpdateBook(bookId, book);
    return data;
  } catch (err) {
    const result = parseErrorAxios(err);
    throw rejectWithValue(result);
  }
});

export const thunkDeleteBook = createAsyncThunk<
  BookInterface,
  { bookId: string }
>("book/deleteBook", async (props, { rejectWithValue }) => {
  try {
    const bookId = props.bookId;
    const { data } = await apiDeleteBook(bookId);
    return data;
  } catch (err) {
    const result = parseErrorAxios(err);
    throw rejectWithValue(result);
  }
});
