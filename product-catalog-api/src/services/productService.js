class ProductService {
    constructor(ProductModel) {
        this.ProductModel = ProductModel;
    }

    async createProduct(productData) {
        const product = new this.ProductModel(productData);
        return await product.save();
    }

    async getProducts() {
        return await this.ProductModel.find();
    }

    async updateProduct(productId, productData) {
        return await this.ProductModel.findByIdAndUpdate(productId, productData, { new: true });
    }

    async deleteProduct(productId) {
        return await this.ProductModel.findByIdAndDelete(productId);
    }

    async searchProducts(query) {
        return await this.ProductModel.find({ name: new RegExp(query, 'i') });
    }

    async filterProducts(filter) {
        return await this.ProductModel.find(filter);
    }
}

export default ProductService;