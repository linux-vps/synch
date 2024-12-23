import { ObjectId } from "mongodb";
import { Column, Entity, ObjectIdColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { SubscriptionDto } from "../dto/subscription.dto";
import { BitrixTokenDto } from "../dto/bitrix-token.dto";
import { GoogleTokenDto } from "../dto/google-token.dto";

@Entity()
export class User {
    @ObjectIdColumn()
    id: ObjectId;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    domain: string;

    @Column('simple-json')
    subscription: {
      type: string;
      expiry: Date;
    };
  
    @Column('simple-json')
    token: {
      bitrix_token: {
        access_token: string;
        refresh_token: string;
      };
      google_token: {
        access_token: string;
        refresh_token: string;
        scope: string;
        token_type: string;
        expiry_date: Date;
      };
    };

    @Column({ nullable: true })
    email?: string;

    @Column({ nullable: true })
    phoneNumber?: string;

    @Column({ nullable: true })
    fullName?: string;

    @Column('simple-array', { nullable: true })
    spreadsheetIds?: string[];
}

