import "./books.scss";

import { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";

import { useAppDispatch, useAppSelector } from "@/store";
import { thunkDeleteBook, thunkGetBooks } from "@/store/book/thunks";
import { thunkShowToast } from "@/store/toast/thunks";
import { debounce, formatDate, paginationComponentOptions } from "@/utils";

import { BookPage } from "./BookPage";
import { BookInterface, Params, SearchFilter } from "@/interfaces/Book";
import { XmarkIcon } from "@/assets/icons";
import { Button, InputSearch, Loader, Modal } from "@/components";

export const BooksPage = () => {
  const dispatch = useAppDispatch();

  const { loadingBooks, books, totalItems } = useAppSelector(
    (store) => store.book
  );

  const [searchFilter, setSearchFilter] = useState<SearchFilter>({});
  const [totalRows, setTotalRows] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [bookId, setBookId] = useState<string | undefined>("");
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [reloadTable, setReloadTable] = useState<boolean>(true);
  const [isWrite, setIsWrite] = useState<boolean>(false);
  const [type, setType] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<BookInterface | null>(null);

  const columns: TableColumn<BookInterface>[] = [
    {
      name: "Titulo",
      selector: (row) => row.title,
      sortable: false,
      width: "20%"
    },
    {
      name: "Autor",
      selector: (row) => row.author,
      sortable: false,
      width: "20%"
    },
    {
      name: "Contenido",
      selector: (row) => row.content.slice(0, 70),
      sortable: false,
      wrap: true,
      width: "35%"
    },
    {
      name: "Fecha de entrada",
      selector: (row) => formatDate(row.publicationDate.toString()),
      sortable: false,
      width: "15%"
    },
    {
      name: "Acciones",
      width: "10%",
      cell: (row) => (
        <div className="books-action-button">
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
              handleClick(event, row)
            }
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleEdit}>Editar</MenuItem>
            <MenuItem onClick={handleMoreInfo}>Más Información</MenuItem>
            <MenuItem onClick={handleDelete}>Eliminar</MenuItem>
          </Menu>
        </div>
      ),
    },
  ];

  const onSearchChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const search = debounce((inputValue: string) => {
      setCurrentPage(1);
      setSearchFilter((prevSearchFilter) => ({
        ...prevSearchFilter,
        [name]: inputValue,
      }));
    });

    search(value);
  };

  const handlePerRowsChange = (newPerPage: number, page: number) => {
    setCurrentPage(page);
    setLimit(newPerPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNew = () => {
    setBookId("");
    setIsWrite(true);
    setType("new");
    setShowConfirm(true);
    setReloadTable(false);
  };

  const handleEdit = () => {
    setBookId(selectedRow?.id);
    setIsWrite(true);
    setType("edit");
    setShowConfirm(true);
    setReloadTable(false);
    handleClose();
  };

  const handleDelete = () => {
    setBookId(selectedRow?.id);
    setReloadTable(false);
    setShowDelete(true);
    handleClose();
  };

  const handleMoreInfo = () => {
    setBookId(selectedRow?.id);
    setIsWrite(false);
    setType("view");
    setShowConfirm(true);
    handleClose();
  };

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    row: BookInterface
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const closeModal = () => {
    setShowConfirm(false);
    setBookId("");
    setReloadTable(true);
  };

  const onDeleteBook = () => {
    setShowDelete(false);
    if (bookId)
      dispatch(thunkDeleteBook({ bookId }))
        .unwrap()
        .then(() => {
          dispatch(
            thunkShowToast({
              show: true,
              type: "success",
              description: "El usuario ha sido eliminado correctamente",
            })
          );
          closeModal();
        })
        .catch(() => {
          dispatch(
            thunkShowToast({
              show: true,
              type: "failed",
              description: "Ha ocurrido un error al intentar eliminar la libro",
            })
          );
        });
  };

  useEffect(() => {
    if (!reloadTable) return;
    const params: Params = {
      page: currentPage,
      limit: limit,
    };

    if (searchFilter) {
      const { author, title, content } = searchFilter;

      if (author) {
        params.author = author;
      }

      if (title) {
        params.title = title;
      }

      if (content) {
        params.content = content;
      }
    }

    dispatch(thunkGetBooks({ params }))
      .unwrap()
      .then(() => {
        setTotalRows(totalItems);
      })
      .catch(() => {
        dispatch(
          thunkShowToast({
            show: true,
            type: "failed",
            description: "Ha ocurrido un error al listar las libros",
          })
        );
      });
  }, [dispatch, searchFilter, limit, currentPage, totalItems, reloadTable]);

  return (
    <div className="books content-height">
      <header className="books-header">
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/dashboard">
            Inicio
          </Link>
          <Link
            underline="hover"
            color="text.primary"
            href="/books"
            aria-current="page"
          >
            Libros
          </Link>
        </Breadcrumbs>
      </header>
      <div className="books-content">
        <div className="books-actions">
          <InputSearch
            positionIconSearch="left"
            placeholder="Buscar por el titulo"
            id="title"
            name="title"
            onChange={onSearchChanged}
          />
          <InputSearch
            positionIconSearch="left"
            placeholder="Buscar por el autor"
            id="author"
            name="author"
            onChange={onSearchChanged}
          />
          <InputSearch
            positionIconSearch="left"
            placeholder="Buscar por contenido"
            id="content"
            name="content"
            onChange={onSearchChanged}
          />
          <Button
            title="Nuevo libro"
            format="primary"
            size="small"
            id="new-book"
            onClick={() => {
              handleNew();
            }}
          />
        </div>
        {books && books.length > 0 && (
          <DataTable
            title="Listado de libros"
            columns={columns}
            data={books || []}
            progressPending={loadingBooks}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            paginationComponentOptions={paginationComponentOptions}
          />
        )}
        {books.length == 0 && (
          <div className="books-content">
            <h3 className="text-center">Sin datos</h3>
          </div>
        )}
        {loadingBooks && <Loader>Espere por favor...</Loader>}
      </div>
      {showConfirm && (
        <Modal
          elementTitle={
            <div className="modal-title">
              <XmarkIcon
                className="modal-close-icon cursor-pointer"
                width={15}
                height={15}
                onClick={() => setShowConfirm(false)}
              />
            </div>
          }
        >
          <div className="modal-body">
            <BookPage
              bookId={bookId}
              type={type}
              closeModal={closeModal}
              isWrite={isWrite}
            />
          </div>
        </Modal>
      )}
      {showDelete && (
        <Modal
          elementTitle={
            <div className="modal-title">
              <b>Confirmación</b>
              <XmarkIcon
                className="modal-close-icon cursor-pointer"
                width={10}
                height={10}
                onClick={() => setShowDelete(false)}
              />
            </div>
          }
          elementFooter={
            <div className="modal-footer">
              <Button
                title="Si"
                format="primary"
                size="small"
                onClick={() => onDeleteBook()}
              ></Button>
              <Button
                title="No"
                format="outline"
                size="small"
                onClick={() => setShowDelete(false)}
              ></Button>
            </div>
          }
        >
          <div className="modal-body">
            <span>¿Estás seguro de eliminar el libro?</span>
          </div>
        </Modal>
      )}
    </div>
  );
};
