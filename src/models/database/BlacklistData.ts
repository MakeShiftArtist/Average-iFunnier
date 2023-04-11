import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryColumn,
	UpdateDateColumn,
} from "typeorm";

@Entity({ name: "blacklist_data" })
class BlacklistData {
	@PrimaryColumn()
	user_id!: string;

	@Column({
		type: "varchar",
	})
	reason!: string;

	@Column({
		type: "boolean",
		default: () => true,
	})
	expires!: boolean;

	@CreateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
	})
	expires_at!: Date;

	@UpdateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP(6)",
		onUpdate: "CURRENT_TIMESTAMP(6)",
	})
	updated_at!: Date;
}
