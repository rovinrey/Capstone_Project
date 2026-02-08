export const setAuth = (token: string, role: "admin" | "beneficiary") => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
};

export const logout = (): void => {
  localStorage.clear();
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

export const getRole = (): "admin" | "beneficiary" | null => {
  const role = localStorage.getItem("role");
  if (role === "admin" || role === "beneficiary") return role;
  return null;
};
