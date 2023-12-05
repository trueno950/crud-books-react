import { ErrorType } from "@/interfaces";

export interface CommonBookInterface {
  title: string;
  author: string;
  content: string;
}

export interface BookInterface {
  id?: string;
  title: string;
  author: string;
  content: string;
  publicationDate: string;
  updatedAt: string;
}

export interface CreateBook extends CommonBookInterface {}

export interface InitialStateBooks {
  errorBook: ErrorType;
  loadingBook: boolean;
  book: BookInterface | undefined;

  errorBooks: ErrorType;
  loadingBooks: boolean;
  totalItems: number;
  books: BookInterface[] | undefined;
}

export interface Props {
  bookId: string | undefined;
  type: string;
  closeModal: () => void;
  isWrite?: boolean;
}

export interface Params {
  page: number;
  limit: number;
  author?: string;
  title?: string;
  content?: string;
}

export interface SearchFilter {
  title?: string;
  author?: string;
  content?: string;
};