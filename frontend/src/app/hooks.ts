import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "./store";

// Erstellung von typisierten Hooks, die den Zugriff auf den Redux-Store-Funktionen(dispatch, getState, subscribe) erleichtern.
// !dispatch is eine Funktion des Redux-Stores
//! Typisierter selector-Hook, der den Zugriff auf den Store-State erlaubt.
export const useAppSelector = useSelector.withTypes<RootState>();
//! Typisierter dispatch-Hook, der den Zugriff auf die Store-Dispatch-Funktion erlaubt.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
