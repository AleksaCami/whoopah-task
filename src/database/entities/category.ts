import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';

// Entities
import { Product } from './product';

// Utils
import {slugify} from "../../utils/global";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column({ unique: true })
  slug: string;

  @OneToMany(() => Product, product => product.category)
  products: Product[];

  @BeforeInsert()
  @BeforeUpdate()
  setSlug() {
    this.slug = slugify(this.title);
  }
}
