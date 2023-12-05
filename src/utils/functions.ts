import dayjs from "dayjs";

export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  waitFor = 800
) => {
  let timeout: NodeJS.Timeout;
  const debounced = (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
  return debounced;
};

export const formatDate = (row: string) =>
  dayjs(row).format("DD/MM/YYYY HH:mm a");

export const paginationComponentOptions = {
  rowsPerPageText: "Filas por página",
  rangeSeparatorText: "de",
  selectAllRowsItem: true,
  selectAllRowsItemText: "Todos",
};
