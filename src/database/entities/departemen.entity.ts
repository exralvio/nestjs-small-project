import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('departements')
export class Departement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  name: string;
}
