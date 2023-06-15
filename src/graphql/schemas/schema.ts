// Import the necessary dependencies
import { gql } from 'apollo-server-koa';

// Define your schema
export const typeDefs = gql`
    type Category {
        id: ID!
        title: String!
        slug: String!
        popularity: Int
    }

    type CategoryPage {
        categories: [Category!]!
        totalCount: Int!
    }

    enum CategorySortField {
        TITLE
        POPULARITY
    }

    type Product {
        id: ID!
        title: String!
        slug: String!
        price: Float!
        categoryId: ID!
        category: Category!
    }
    
    type ProductPage {
        products: [Product!]!
        totalCount: Int!
    }

    enum ProductSortField {
        CREATION_DATE
    }

    input CategoryInput {
        title: String!
    }

    input ProductInput {
        title: String!
        price: Float!
        categoryId: ID!
    }

    type Mutation {
        createCategory(category: CategoryInput!): Category
        createProduct(product: ProductInput!): Product
    }

    type Query {
        getCategories(
            page: Int = 1
            pageSize: Int = 10
            sortBy: CategorySortField = TITLE
        ): CategoryPage!
        getProducts(
            page: Int = 1
            pageSize: Int = 10
            sortBy: ProductSortField = CREATION_DATE
            categoryId: ID
        ): ProductPage!
    }
`;
