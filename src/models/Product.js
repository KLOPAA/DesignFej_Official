// Model - Product
class Product {
    constructor(id, name, price, image, details, category = 'geral') {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.details = details;
        this.category = category;
    }

    static validate(productData) {
        const errors = [];
        
        if (!productData.name || productData.name.trim().length < 2) {
            errors.push('Nome do produto deve ter pelo menos 2 caracteres');
        }
        
        if (!productData.price || productData.price <= 0) {
            errors.push('Preço deve ser maior que zero');
        }
        
        if (!productData.details || productData.details.trim().length < 5) {
            errors.push('Detalhes devem ter pelo menos 5 caracteres');
        }
        
        return errors;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            image: this.image,
            details: this.details,
            category: this.category
        };
    }
}

export default Product;