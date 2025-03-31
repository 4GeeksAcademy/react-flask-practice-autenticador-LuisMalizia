const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			auth: false,
			user: "",
			logged: false,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			login: async (email, password) => {
				const myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");

				const raw = JSON.stringify({
					"email": email,
					"password": password
				});

				const requestOptions = {
					method: "POST",
					headers: myHeaders,
					body: raw,
					redirect: "follow"
				};

				try {
					const response = await fetch("https://obscure-carnival-q79jwv99p9q62499g-3001.app.github.dev/api/login", requestOptions);
					const result = await response.json();
					if (response.status === 200) {
						localStorage.setItem("token", result.access_token)
						getActions().verifyToken()
						getActions().getPrivate()
						setStore({ logged: true })
					} else if (response.status === 404 || response.status === 400) {
						setStore({ logged: false })
					}
				} catch (error) {
					console.error(error);
					return false;
				};
			},
			getPrivate: async () => {
				let token = localStorage.getItem("token")
				try {
					const response = await fetch("https://obscure-carnival-q79jwv99p9q62499g-3001.app.github.dev/api/private", {
						method: "GET",
						headers: {
							"Authorization": `Bearer ${token}`
						},
					});
					const result = await response.json();
					setStore({ user: result.logged_in_as })

				} catch (error) {
					console.error(error);
				};
			},
			verifyToken: async () => {
				let token = localStorage.getItem("token")
				try {
					const response = await fetch("https://obscure-carnival-q79jwv99p9q62499g-3001.app.github.dev/api/verify-token", {
						method: "GET",
						headers: {
							"Authorization": `Bearer ${token}`
						},
					});
					const result = await response.json();
					setStore({ auth: result.valid })
				} catch (error) {
					console.error(error);
				};
			},
			logout: () => {
				//borrar el token del localStorage
				localStorage.removeItem("token")
				setStore({ logged: false })
				getActions().verifyToken()
			},
			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;