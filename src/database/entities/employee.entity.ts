import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Departement } from './departemen.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  firstName: string;

  @Column({ type: 'varchar', length: 150 })
  lastName: string;

  @ManyToOne(() => Departement, (departement) => departement.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'departement_id' })
  departement: Departement;
}
