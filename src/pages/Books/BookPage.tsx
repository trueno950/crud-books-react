import "./books.scss";

import { useCallback, useEffect, useState } from "react";
import { Button, Label, Loader } from "@/components";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { useAppDispatch, useAppSelector } from "@/store";
import { thunkShowToast } from "@/store/toast/thunks";
import {
  thunkCreateBook,
  thunkGetBook,
  thunkUpdateBook,
} from "@/store/book/thunks";
import { formatDate } from "@/utils";
import { Props } from "@/interfaces/Book";

export const BookPage = ({ bookId, type, closeModal, isWrite }: Props) => {
  const dispatch = useAppDispatch();
  const { book, loadingBook } = useAppSelector((store) => store.book);

  const [formValues, setFormValues] = useState<{
    title: string;
    author: string;
    content: string;
    publicationDate: string;
  }>({
    title: "",
    author: "",
    content: "",
    publicationDate: "",
  });

  const onInputChanged = ({
    target,
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormValues({ ...formValues, [target.name]: target.value });
  };

  const formSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bodyBook = {
      title: formValues.title,
      author: formValues.author,
      content: formValues.content,
    };

    if (type === "new") {
      dispatch(thunkCreateBook({ book: bodyBook }))
        .unwrap()
        .then(() => {
          dispatch(
            thunkShowToast({
              show: true,
              type: "success",
              description: "Libro creado con éxito",
            })
          );
          closeModal();
        })
        .catch(() => {
          dispatch(
            thunkShowToast({
              show: true,
              type: "failed",
              description:
                "Ha ocurrido un error al intentar guardar la información",
            })
          );
          closeModal();
        });
    } else {
      dispatch(
        thunkUpdateBook({
          book: bodyBook,
          bookId: bookId ?? "",
        })
      )
        .unwrap()
        .then(() => {
          dispatch(
            thunkShowToast({
              show: true,
              type: "success",
              description: "Libro actualizado con éxito",
            })
          );
          closeModal();
        })
        .catch(() => {
          dispatch(
            thunkShowToast({
              show: true,
              type: "failed",
              description:
                "Ha ocurrido un error al intentar actualizar la información",
            })
          );
          closeModal();
        });
    }
  };

  const get_info_book = useCallback(() => {
    if (bookId) {
      dispatch(thunkGetBook({ bookId })).catch(() => {
        dispatch(
          thunkShowToast({
            show: true,
            type: "failed",
            description:
              "Ha ocurrido un error al obtener la información de la libro",
          })
        );
      });
    }
  }, [bookId, dispatch]);

  useEffect(() => {
    get_info_book();
  }, [get_info_book]);

  useEffect(() => {
    if (!book || type == "new") {
      return;
    }
    setFormValues({
      ...book,
    });
  }, [book]);

  return (
    <>
      {loadingBook && (
        <Loader>Espere por favor, procesando información...</Loader>
      )}
      {!loadingBook && (
        <div className="books content-height">
          <header className="books-header-details">
            <h2>{type === "new" ? "Nuevo libro" : "Datos del libro"}</h2>
          </header>
          <div className="books-content-details">
            {type == "view" && (
              <div className="blog-post">
                <header>
                  <h2>{formValues.title}</h2>
                </header>
                <main>
                  <p>
                    Autor: <strong>{formValues.author}</strong>
                  </p>
                  <p>
                    Fecha de Publicación:{" "}
                    <strong>{formatDate(formValues.publicationDate)}</strong>
                  </p>
                  <p>{formValues.content}</p>
                </main>
                <footer>
                  Blog - Todos los derechos reservados &copy; {2023}
                </footer>
              </div>
            )}
            {type != "view" && (
              <form className="form" onSubmit={formSubmit}>
                <div className="form-name">
                  <TextField
                    required
                    id="title"
                    name="title"
                    value={formValues.title}
                    onChange={onInputChanged}
                    disabled={!isWrite}
                    label="Nombre del libro:"
                  />
                </div>

                <div className="form-name">
                  <TextField
                    required
                    id="author"
                    name="author"
                    value={formValues.author}
                    onChange={onInputChanged}
                    disabled={!isWrite}
                    label="Nombre del autor:"
                  />
                </div>

                <div className="form-name">
                  <Label labelText="Contenido:" />
                  <TextareaAutosize
                    required
                    id="content"
                    name="content"
                    value={formValues.content}
                    onChange={onInputChanged}
                    disabled={!isWrite}
                  />
                </div>

                <div className="form-action">
                  <Button
                    title={type == "new" ? "Guardar libro" : "Editar libro"}
                    disabled={formValues.title === ""}
                    format="primary"
                  />
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
