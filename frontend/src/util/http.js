// auth
export const authStatus = async () => {
  await new Promise((r) => setTimeout(r, 2000));
  const response = await fetch("http://localhost:3000/api/v1/auth/status", {
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong.");
  }

  const data = await response.json();
  return data;
};

export const signup = async (userData) => {
  const response = await fetch("http://localhost:3000/api/v1/auth/signup", {
    method: "POST",
    body: JSON.stringify(userData),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong.");
  }

  const data = await response.json();
  return data;
};

export const login = async (userData) => {
  const response = await fetch("http://localhost:3000/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(userData),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong.");
  }

  const data = await response.json();
  return data;
};

export const logout = async () => {
  const response = await fetch("http://localhost:3000/api/v1/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong.");
  }

  const data = await response.json();
  return data;
};

export const reset = async (userData) => {
  const response = await fetch("http://localhost:3000/api/v1/auth/reset", {
    method: "POST",
    body: JSON.stringify(userData),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong.");
  }

  const data = await response.json();
  return data;
};

export const verifyOtp = async (userData) => {
  const response = await fetch("http://localhost:3000/api/v1/auth/otp", {
    method: "POST",
    body: JSON.stringify(userData),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong.");
  }

  const data = await response.json();
  return data;
};

export const changePassword = async (userData) => {
  const response = await fetch(
    "http://localhost:3000/api/v1/auth/changepassword",
    {
      method: "POST",
      body: JSON.stringify(userData),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong.");
  }

  const data = await response.json();
  return data;
};

// profile
export const myProfile = async () => {
  const response = await fetch(`http://localhost:3000/api/v1/profile/`, {
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong.");
  }

  const data = await response.json();
  return data;
};

export const userProfile = async (signal, username) => {
  const response = await fetch(
    `http://localhost:3000/api/v1/profile/${username}`,
    {
      signal,
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong.");
  }

  const data = await response.json();
  return data;
};

// settings
export const settings = async (signal) => {
  const response = await fetch("http://localhost:3000/api/v1/settings", {
    signal,
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong.");
  }

  const data = await response.json();
  return data;
};

export const updateProfile = async (userData) => {
  const response = await fetch(
    "http://localhost:3000/api/v1/settings/update-profile",
    {
      method: "POST",
      body: userData,
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong.");
  }

  const data = await response.json();
  return data;
};

export const online = async (signal) => {
  const response = await fetch("http://localhost:3000/api/v1/online", {
    signal,
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong.");
  }

  const data = await response.json();
  return data;
};
