import { Navigate, Route, Routes } from "react-router-dom";

import { AxiosInterceptor, Footer, Header, Toast } from "@/components";
import { useAppDispatch, useAppSelector } from "@/store";
import { thunkShowToast } from "@/store/toast/thunks";

import { NotFoundPage } from "./NotFoundPage";
import { BooksPage } from "../pages/Books";

export const AppRouter = () => {
  const dispatch = useAppDispatch();
  const { description, show, type } = useAppSelector((store) => store.toast);
  return (
    <AxiosInterceptor>
      <>
        <Header />
        <Routes>
          <Route
            index
            path="/"
            element={<Navigate to="/dashboard"></Navigate>}
          />
          <Route path="dashboard" element={<BooksPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
        {show && (
          <Toast
            type={type}
            description={description}
            callBack={() =>
              dispatch(
                thunkShowToast({
                  show: false,
                  type: "success",
                  description: "",
                })
              )
            }
          />
        )}
      </>
    </AxiosInterceptor>
  );
};
