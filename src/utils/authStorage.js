// Storage helper for session and persistent (30-day) authentication tokens

export const getStudentToken = () => {
  return localStorage.getItem('student_token') || sessionStorage.getItem('student_token');
};

export const setStudentAuth = (token, studentInfo, remember = false) => {
  if (remember) {
    localStorage.setItem('student_token', token);
    if (studentInfo) localStorage.setItem('student_info', JSON.stringify(studentInfo));
    // Clean up session storage so there's a single source of truth
    sessionStorage.removeItem('student_token');
    sessionStorage.removeItem('student_info');
  } else {
    sessionStorage.setItem('student_token', token);
    if (studentInfo) sessionStorage.setItem('student_info', JSON.stringify(studentInfo));
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_info');
  }
};

export const clearStudentAuth = () => {
  localStorage.removeItem('student_token');
  localStorage.removeItem('student_info');
  sessionStorage.removeItem('student_token');
  sessionStorage.removeItem('student_info');
};

export const getStudentInfo = () => {
  const stored = localStorage.getItem('student_info') || sessionStorage.getItem('student_info');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const getClientToken = () => {
  return localStorage.getItem('client_token') || sessionStorage.getItem('client_token');
};

export const setClientAuth = (token, clientInfo, remember = false) => {
  if (remember) {
    localStorage.setItem('client_token', token);
    if (clientInfo) localStorage.setItem('client_info', JSON.stringify(clientInfo));
    sessionStorage.removeItem('client_token');
    sessionStorage.removeItem('client_info');
  } else {
    sessionStorage.setItem('client_token', token);
    if (clientInfo) sessionStorage.setItem('client_info', JSON.stringify(clientInfo));
    localStorage.removeItem('client_token');
    localStorage.removeItem('client_info');
  }
};

export const clearClientAuth = () => {
  localStorage.removeItem('client_token');
  localStorage.removeItem('client_info');
  sessionStorage.removeItem('client_token');
  sessionStorage.removeItem('client_info');
};

export const getClientInfo = () => {
  const stored = localStorage.getItem('client_info') || sessionStorage.getItem('client_info');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};
