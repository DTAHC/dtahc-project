import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum ClientType {
  PARTICULAR = 'particular',
  PROFESSIONNEL = 'professionnel'
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
}

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  reference: string;

  @Column({
    type: 'enum',
    enum: ClientType,
    default: ClientType.PARTICULAR
  })
  clientType: ClientType;

  @Column({ nullable: true })
  proReferenceId: string;

  @Column()
  createdById: string;

  @Column({ type: 'json', nullable: true })
  contactInfo: ContactInfo;
}