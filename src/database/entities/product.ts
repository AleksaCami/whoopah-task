import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeInsert, BeforeUpdate } from 'typeorm';

// Entities
import { Category } from './category';

// Utils
import {slugify} from "../../utils/global";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Category, category => category.products)
  category: Category;

  @BeforeInsert()
  @BeforeUpdate()
  setSlug() {
    this.slug = slugify(this.title);
  }
}
