import api from './axiosInstance'

// Backend contract this expects (build these routes on the Express side):
// POST /api/auth/register        { name, email, password, role }        -> { token, user }
// POST /api/auth/login           { email, password, role }              -> { token, user }
// GET  /api/auth/me                                                     -> { user }

export const registerUser = async (payload) => {
  const { data } = await api.post('/auth/register', payload)
  return data
}

export const loginUser = async (payload) => {
  const { data } = await api.post('/auth/login', payload)
  return data
}

export const fetchCurrentUser = async () => {
  const { data } = await api.get('/auth/me')
  return data
}
