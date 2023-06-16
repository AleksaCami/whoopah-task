// Data Source
import dataSource from '../../database/typeorm-cli.datasource';

// Services
import pubsub from '../../services/graphql-subscriptions.service';

// Entities
import { Category } from '../../database/entities/category';
import { Product } from '../../database/entities/product';

export const resolvers = {
  Subscription: {
    hello: {
      // Example using an async generator
      subscribe: async function* () {
        for await (const word of ['Hello', 'Bonjour', 'Ciao']) {
          yield { hello: word };
        }
      },
    },
    productCreated: {
      subscribe: () => pubsub.asyncIterator('PRODUCT_CREATED'),
    },
  },
  Query: {
    getCategories: async (parent, { page, pageSize, sortBy }, context) => {
      const categoryRepository = dataSource.getRepository(Category);

      // Calculate the offset for pagination
      const offset = (page - 1) * pageSize;

      // Create a query builder to fetch categories
      const queryBuilder = categoryRepository.createQueryBuilder('category');

      // Apply sorting
      if (sortBy === 'POPULARITY') {
        queryBuilder.orderBy('category.productsCount', 'DESC');
      } else {
        queryBuilder.orderBy('category.title', 'ASC');
      }

      // Fetch the categories with pagination
      const [categories, totalCount] = await queryBuilder
        .leftJoinAndSelect('category.products', 'product')
        .select('category')
        .addSelect('COUNT(product.id)', 'productsCount')
        .groupBy('category.id')
        .offset(offset)
        .limit(pageSize)
        .getManyAndCount();

      return {
        categories,
        totalCount,
      };
    },
    getProducts: async (
      parent,
      { page, pageSize, sortBy, categoryId },
      context,
    ) => {
      const productRepository = dataSource.getRepository(Product);

      // Create the base query
      let query = productRepository.createQueryBuilder('product');

      // Apply category filter if provided
      if (categoryId) {
        query = query.where('product.categoryId = :categoryId', { categoryId });
      }

      // Count total number of products
      const totalCount = await query.getCount();

      // Apply sorting
      if (sortBy === 'CREATION_DATE') {
        query = query.orderBy('product.createdAt', 'DESC');
      }

      // Apply pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      query = query.skip(startIndex).take(pageSize);

      // Fetch the products
      const products = await query.getMany();

      return {
        products,
        totalCount,
      };
    },
  },
  Mutation: {
    createCategory: async (parent, { category }, context) => {
      const { title } = category;

      if (!title) {
        throw new Error('Title is required');
      }

      const categoryRepository = dataSource.getRepository(Category);

      const newCategory = categoryRepository.create({ title });
      await categoryRepository.save(newCategory);
      // and return the created category object
      return newCategory;
    },
    createProduct: async (parent, { product }, context) => {
      const { title, price, categoryId } = product;

      if (!title) {
        throw new Error('Title is required');
      }

      if (!price) {
        throw new Error('Price is required');
      }

      if (!categoryId) {
        throw new Error('Category is required');
      }

      const productRepository = dataSource.getRepository(Product);

      const newProduct = productRepository.create({ title, price, categoryId });
      await productRepository.save(newProduct);

      await pubsub.publish('PRODUCT_CREATED', { productCreated: newProduct });

      // and return the created product object
      return newProduct;
    },
  },
  Product: {
    category: (parent: Product): Promise<Category | null> => {
      const categoryRepo = dataSource.getRepository(Category);

      return categoryRepo.findOne({
        where: { id: parent.categoryId },
      });
    },
  },
  Category: {
    products: (parent: Category): Promise<Product[] | null> => {
      const productRepo = dataSource.getRepository(Product);

      return productRepo.find({ where: { categoryId: parent.id } });
    },
  },
};
