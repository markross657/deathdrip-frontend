import CartService from "./CartService";
import imageService from "./ImageService"
const API_BASE_URL='http://3.26.170.85';

class UserService {
    constructor() {
        this.token = null
        this.setHasUser = null
        const userData = sessionStorage.getItem('user')
        this.user = userData === null ? null : JSON.parse(userData)
        if (this.user === null) {
            CartService.emptyCart();
        }
    }

    getUser() {
        return JSON.stringify(this.user) === null ? null : this.user
    }

    getToken() {
        return this.token
    }

    async login(email, password) {
        console.log("attempting login");
        const url = `${API_BASE_URL}/auth/signin`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            console.log("Api call made");

            if (response.ok) {
                const userData = await response.json()
                this.token = userData.accessToken
                this.user = userData.user
                this.updateSessionStorage()
                this.setHasUser(true)
                return this.user;
            }
            else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Unknown error';

                switch (response.status) {
                    case 400:
                        throw new Error(`Bad request: ${errorMessage}`);
                    case 401:
                        throw new Error(`Unauthorized: ${errorMessage}`);
                    case 403:
                        throw new Error(`Forbidden: ${errorMessage}`);
                    case 404:
                        throw new Error(`Not found: ${errorMessage}`);
                    case 500:
                        throw new Error(`Internal Server Error: ${errorMessage}`);
                    default:
                        throw new Error(`An error occurred: ${errorMessage}`);
                }
            }
        }
        catch (error) {
            throw new Error(`An error occurred: ${error.message}`);
        }
    }

    async register(userData) {
        const url = `${API_BASE_URL}/user`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error('An error occurred during registration: ' + error.message);
        }
    }

    logout() {
        this.user = null
        this.token = null
        CartService.emptyCart();
        this.updateSessionStorage()
        this.setHasUser(false)
    }

    async updateUser(user) {
        if (user.firstName !== this.user.firstName) {
            this.user.firstName = user.firstName;
        }
        if (user.lastName !== this.user.lastName) {
            this.user.lastName = user.lastName
        }
        if (user.bio !== this.user.bio) {
            this.user.bio = user.bio
        }
    }

    async updateUserImage(file){
        imageService.uploadUserImage(this.user.id, file);
    }

    setUserControl({ setHasUser }) {
        this.setHasUser = setHasUser
    }

    updateSessionStorage() {
        const userStr = JSON.stringify(this.user)
        sessionStorage.setItem('user', userStr);
    }
}

const service = new UserService()
export default service
