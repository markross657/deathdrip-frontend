import axios from 'axios';

//const API_BASE_URL='http://3.26.170.85'
const API_BASE_URL='http://localhost:3520'

const ImageService = {
    async uploadUserImage(userId, imageFile) {
        try {
            // Create FormData object to send file data
            const formData = new FormData();
            formData.append('image', imageFile);

            const uploadResponse = await axios.post(`${API_BASE_URL}/image/user/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return uploadResponse.data.imageUrl;
        } catch (error) {
            console.error('Error uploading user image:', error);
            throw error;
        }
    },

    async uploadProductImage(productId, imageFile) {
        try {
            // Create FormData object to send file data
            const formData = new FormData();
            formData.append('image', imageFile);

            const uploadResponse = await axios.post(`${API_BASE_URL}/products/${productId}/image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return uploadResponse.data.imageUrl;
        } catch (error) {
            console.error('Error uploading product image:', error);
            throw error;
        }
    }
};

export default ImageService;
