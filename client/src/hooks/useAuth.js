import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";

/** Accès à la session : const { user, status, login, register, logout } = useAuth(); */
export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth)
    throw new Error(
      "useAuth doit être utilisé à l’intérieur de <AuthProvider>",
    );
  return auth;
}
