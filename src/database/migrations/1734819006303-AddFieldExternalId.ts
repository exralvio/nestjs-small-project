import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddFieldExternalId1734819006303 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'departments',
      new TableColumn({
        name: 'external_id',
        type: 'varchar',
        length: '50',
      }),
    );

    await queryRunner.addColumn(
      'employees',
      new TableColumn({
        name: 'external_id',
        type: 'varchar',
        length: '50',
      }),
    );

    await queryRunner.addColumn(
      'statements',
      new TableColumn({
        name: 'external_id',
        type: 'varchar',
        length: '50',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('statements', 'external_id');

    await queryRunner.dropColumn('employees', 'external_id');

    await queryRunner.dropColumn('departments', 'external_id');
  }
}
