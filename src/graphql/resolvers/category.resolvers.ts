// Data Source
import dataSource from "../../database/typeorm-cli.datasource";

// Entities
import {Category} from "../../database/entities/category";

export const resolvers = {
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
  },
};
