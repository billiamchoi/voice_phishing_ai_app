import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:5000"
// baseURL = "http://10.0.2.2:5000"
})

// Apply default error handler
axiosInstance.interceptors.response.use(function (response) {

  console.log(response)
  return response;
}, function (error) {
  console.log(error)
  return Promise.reject(error);
});

export default axiosInstance
