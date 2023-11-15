import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  constructor(handle: string, address: string) {
    this.handle = handle;
    this.address = address;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true, })
  handle?: string;
  
  @Column({ unique: true, nullable: true, })
  address: string;
}
