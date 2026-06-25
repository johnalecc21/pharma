import { MigrationInterface, QueryRunner } from "typeorm";

export class Inicial1782418917020 implements MigrationInterface {
    name = 'Inicial1782418917020'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "usuario_id" uuid NOT NULL, "token_hash" character varying(64) NOT NULL, "expira_en" TIMESTAMP WITH TIME ZONE NOT NULL, "revocado_en" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c8349fdadc1bc791125bdd8c85" ON "refresh_tokens" ("usuario_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a7838d2ba25be1342091b6695f" ON "refresh_tokens" ("token_hash") `);
        await queryRunner.query(`CREATE INDEX "IDX_44dbfede92631baafba0d208cf" ON "medicamentos" ("fecha_vencimiento") `);
        await queryRunner.query(`CREATE INDEX "IDX_7a19a69d52a6ee8e62f0a1b410" ON "detalle_venta" ("venta_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_fc2db01d1c531befc2c9772ef8" ON "detalle_venta" ("medicamento_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_5c564fe8d2b5182a3721140582" ON "ventas" ("usuario_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_4db7514cff921e78d93fe1284f" ON "ventas" ("fecha") `);
        await queryRunner.query(`ALTER TABLE "medicamentos" ADD CONSTRAINT "CHK_e76cea51acf636d096c82b6450" CHECK ("stock" >= 0)`);
        await queryRunner.query(`ALTER TABLE "medicamentos" ADD CONSTRAINT "CHK_df19d0e88e6ad766a89c9033b7" CHECK ("precio_unitario" > 0)`);
        await queryRunner.query(`ALTER TABLE "detalle_venta" ADD CONSTRAINT "CHK_e6915f41359ff9b745b5be0b78" CHECK ("subtotal" >= 0)`);
        await queryRunner.query(`ALTER TABLE "detalle_venta" ADD CONSTRAINT "CHK_2450eec8cb9b741f990078cd99" CHECK ("precio_unitario_snapshot" >= 0)`);
        await queryRunner.query(`ALTER TABLE "detalle_venta" ADD CONSTRAINT "CHK_e0fc8586930425d9dab62163c5" CHECK ("cantidad" > 0)`);
        await queryRunner.query(`ALTER TABLE "ventas" ADD CONSTRAINT "CHK_39eacd8a187e9d24429c4727a6" CHECK ("total" >= 0)`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_c8349fdadc1bc791125bdd8c855" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_c8349fdadc1bc791125bdd8c855"`);
        await queryRunner.query(`ALTER TABLE "ventas" DROP CONSTRAINT "CHK_39eacd8a187e9d24429c4727a6"`);
        await queryRunner.query(`ALTER TABLE "detalle_venta" DROP CONSTRAINT "CHK_e0fc8586930425d9dab62163c5"`);
        await queryRunner.query(`ALTER TABLE "detalle_venta" DROP CONSTRAINT "CHK_2450eec8cb9b741f990078cd99"`);
        await queryRunner.query(`ALTER TABLE "detalle_venta" DROP CONSTRAINT "CHK_e6915f41359ff9b745b5be0b78"`);
        await queryRunner.query(`ALTER TABLE "medicamentos" DROP CONSTRAINT "CHK_df19d0e88e6ad766a89c9033b7"`);
        await queryRunner.query(`ALTER TABLE "medicamentos" DROP CONSTRAINT "CHK_e76cea51acf636d096c82b6450"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4db7514cff921e78d93fe1284f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5c564fe8d2b5182a3721140582"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fc2db01d1c531befc2c9772ef8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7a19a69d52a6ee8e62f0a1b410"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_44dbfede92631baafba0d208cf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a7838d2ba25be1342091b6695f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c8349fdadc1bc791125bdd8c85"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    }

}
