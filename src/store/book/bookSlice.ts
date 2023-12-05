import { createSlice } from "@reduxjs/toolkit";
import { InitialStateBooks } from "@/interfaces/Book";
import {
  thunkCreateBook,
  thunkDeleteBook,
  thunkGetBook,
  thunkGetBooks,
  thunkUpdateBook,
} from "./thunks";

const getInitialState = (): InitialStateBooks => {
  return {
    errorBook: undefined,
    loadingBook: false,
    book: undefined,

    errorBooks: undefined,
    loadingBooks: false,
    totalItems: 0,
    books: [],
  };
};

export const bookSlice = createSlice({
  name: "book",
  initialState: getInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(thunkCreateBook.pending, (state) => {
      if (!state.loadingBook) state.loadingBook = true;
      state.errorBook = undefined;
    });
    builder.addCase(thunkCreateBook.fulfilled, (state, action) => {
      state.errorBook = undefined;
      state.loadingBook = false;
      state.book = action.payload;
    });
    builder.addCase(thunkCreateBook.rejected, (state) => {
      state.loadingBook = false;
      state.errorBook = {
        error_description: "Ha ocurrido un error al crear la libro",
      };
    });

    builder.addCase(thunkGetBook.pending, (state) => {
      if (!state.loadingBook) state.loadingBook = true;
      state.errorBook = undefined;
    });
    builder.addCase(thunkGetBook.fulfilled, (state, action) => {
      state.errorBook = undefined;
      state.loadingBook = false;
      state.book = action.payload;
    });
    builder.addCase(thunkGetBook.rejected, (state) => {
      state.loadingBook = false;
      state.errorBook = {
        error_description:
          "Ha ocurrido un error al obtener la información de la libro",
      };
    });

    builder.addCase(thunkGetBooks.pending, (state) => {
      if (!state.loadingBooks) state.loadingBooks = true;
      state.errorBooks = undefined;
    });
    builder.addCase(thunkGetBooks.fulfilled, (state, action) => {
      state.errorBooks = undefined;
      state.loadingBooks = false;
      state.books = action.payload.books;
      state.totalItems = action.payload.paging.total_items;
    });
    builder.addCase(thunkGetBooks.rejected, (state) => {
      state.loadingBooks = false;
      state.errorBooks = {
        error_description:
          "Ha ocurrido un error al obtener la información de las libros",
      };
    });

    builder.addCase(thunkUpdateBook.pending, (state) => {
      if (!state.loadingBook) state.loadingBook = true;
      state.errorBook = undefined;
    });
    builder.addCase(thunkUpdateBook.fulfilled, (state, action) => {
      state.errorBook = undefined;
      state.loadingBook = false;
      state.book = action.payload;
    });
    builder.addCase(thunkUpdateBook.rejected, (state) => {
      state.loadingBook = false;
      state.errorBook = {
        error_description: "Ha ocurrido un error al actualizar la libro",
      };
    });

    builder.addCase(thunkDeleteBook.pending, (state) => {
      if (!state.loadingBook) state.loadingBook = true;
      state.errorBook = undefined;
    });
    builder.addCase(thunkDeleteBook.fulfilled, (state, action) => {
      state.errorBook = undefined;
      state.loadingBook = false;
      state.book = action.payload;
    });
    builder.addCase(thunkDeleteBook.rejected, (state) => {
      state.loadingBook = false;
      state.errorBook = {
        error_description:
          "Ha ocurrido un error al tratar de eliminar la libro",
      };
    });
  },
});

export default bookSlice.reducer;