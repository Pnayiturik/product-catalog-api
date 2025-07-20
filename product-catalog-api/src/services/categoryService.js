class CategoryService {
    constructor(CategoryModel) {
        this.CategoryModel = CategoryModel;
    }

    async createCategory(categoryData) {
        const category = new this.CategoryModel(categoryData);
        return await category.save();
    }

    async getCategories() {
        return await this.CategoryModel.find();
    }

    async getCategoryById(categoryId) {
        return await this.CategoryModel.findById(categoryId);
    }

    async updateCategory(categoryId, categoryData) {
        return await this.CategoryModel.findByIdAndUpdate(categoryId, categoryData, { new: true });
    }

    async deleteCategory(categoryId) {
        return await this.CategoryModel.findByIdAndDelete(categoryId);
    }
}

export default CategoryService;