import { ContextApi } from "../helper/ContextApi";
import { useContext } from "react";

export const useContextApi = () => {
  return useContext(ContextApi);
};