import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateDonationsTable1734780228095 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'donations',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'employee_id',
            type: 'int',
          },
          {
            name: 'date',
            type: 'date',
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'donations',
      new TableForeignKey({
        columnNames: ['employee_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'employees',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('donations');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('employee_id') !== -1,
    );
    await queryRunner.dropForeignKey('donations', foreignKey);

    await queryRunner.dropTable('donations');
  }
}
