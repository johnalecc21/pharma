import { MigrationInterface, QueryRunner } from 'typeorm';

export class TriggerUpdatedAt1782450000000 implements MigrationInterface {
  name = 'TriggerUpdatedAt1782450000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION set_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_medicamentos_updated_at
      BEFORE UPDATE ON "medicamentos"
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_medicamentos_updated_at ON "medicamentos"`,
    );
    await queryRunner.query(`DROP FUNCTION IF EXISTS set_updated_at()`);
  }
}
