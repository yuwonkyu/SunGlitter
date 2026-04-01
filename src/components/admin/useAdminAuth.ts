import { useCallback, useEffect, useState } from "react";
import { checkAdminAuth, loginAdmin, logoutAdmin } from "./adminApi";

const useAdminAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const auth = await checkAdminAuth();
        setAuthenticated(auth);
      } finally {
        setIsLoading(false);
      }
    };

    void bootstrap();
  }, []);

  const tryLogin = useCallback(async () => {
    const ok = await loginAdmin(password);
    if (ok) {
      setAuthenticated(true);
      setPassword("");
    }

    return ok;
  }, [password]);

  const handleLogout = useCallback(async () => {
    await logoutAdmin();
    setAuthenticated(false);
  }, []);

  return {
    isLoading,
    authenticated,
    password,
    setPassword,
    tryLogin,
    handleLogout,
  };
};

export default useAdminAuth;
