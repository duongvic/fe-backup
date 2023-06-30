import axios from 'axios';
// import queryString from 'query-string';
// Set up default config for http requests here
// Please have a look at here `https://github.com/axios/axios#request- config` for the full list of configs
import TokenService from "./token.service";
const axiosClient = axios.create({
	baseURL: process.env.REACT_APP_API_URL
});

axiosClient.interceptors.request.use(
	async (config) => {
		config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('access_token');
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

axiosClient.interceptors.response.use(
	(response) => {
		if (response && response.data) {
			return response.data;
		}
		return response;
	},
	(error) => {
		// Handle errors
		throw error;
	}
);

axiosClient.interceptors.response.use(
	(res) => {
		return res;
	},
	async (err) => {
		const originalConfig = err.config;

		// if (originalConfig.url !== "/api/v1/benji/login" && err.response) {
		//   // Access Token was expired
		//   if (err.response.status === 401 && !originalConfig._retry) {
		//     originalConfig._retry = true;
		//     try {
		//       const rs = await axiosClient.put("/api/v1/benji/refresh", {
		//         refreshToken: TokenService.getLocalRefreshToken(),
		//       });
		//       const { access_token } = rs.data;
		//       TokenService.updateLocalAccessToken(access_token);
		//       return axiosClient(originalConfig);
		//     } catch (_error) {
		//       return Promise.reject(_error);
		//     }
		//   }
		// }

		return Promise.reject(err);
	}
);

export default axiosClient;