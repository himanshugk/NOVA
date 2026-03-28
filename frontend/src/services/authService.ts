import API_BASE from "./api";

export const registerUser = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const guestLogin = async () => {
  const res = await fetch(`${API_BASE}/auth/guest`, {
    method: "POST",
  });
  return res.json();
};

export const linkAccount = async (data: {
  email: string;
  password: string;
}, token: string) => {
  const res = await fetch(`${API_BASE}/auth/link`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
