import { MigrationInterface, QueryRunner } from "typeorm";

export class TimestamptzInstantes1782437184865 implements MigrationInterface {
    name = 'TimestamptzInstantes1782437184865'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" ALTER COLUMN "created_at" TYPE timestamptz USING "created_at" AT TIME ZONE 'UTC'`);
        await queryRunner.query(`ALTER TABLE "medicamentos" ALTER COLUMN "created_at" TYPE timestamptz USING "created_at" AT TIME ZONE 'UTC'`);
        await queryRunner.query(`ALTER TABLE "medicamentos" ALTER COLUMN "updated_at" TYPE timestamptz USING "updated_at" AT TIME ZONE 'UTC'`);
        await queryRunner.query(`ALTER TABLE "ventas" ALTER COLUMN "fecha" TYPE timestamptz USING "fecha" AT TIME ZONE 'UTC'`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ALTER COLUMN "created_at" TYPE timestamptz USING "created_at" AT TIME ZONE 'UTC'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ALTER COLUMN "created_at" TYPE timestamp USING "created_at" AT TIME ZONE 'UTC'`);
        await queryRunner.query(`ALTER TABLE "ventas" ALTER COLUMN "fecha" TYPE timestamp USING "fecha" AT TIME ZONE 'UTC'`);
        await queryRunner.query(`ALTER TABLE "medicamentos" ALTER COLUMN "updated_at" TYPE timestamp USING "updated_at" AT TIME ZONE 'UTC'`);
        await queryRunner.query(`ALTER TABLE "medicamentos" ALTER COLUMN "created_at" TYPE timestamp USING "created_at" AT TIME ZONE 'UTC'`);
        await queryRunner.query(`ALTER TABLE "usuarios" ALTER COLUMN "created_at" TYPE timestamp USING "created_at" AT TIME ZONE 'UTC'`);
    }

}
