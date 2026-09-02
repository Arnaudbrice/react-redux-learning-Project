import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "./store";

// Erstellung von typisierten Hooks, die den Zugriff auf den Redux-Store erleichtern.
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
