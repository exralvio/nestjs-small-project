import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateStatementsTable1734780221557 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'statements',
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
      'statements',
      new TableForeignKey({
        columnNames: ['employee_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'employees',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('statements');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('employee_id') !== -1,
    );
    await queryRunner.dropForeignKey('statements', foreignKey);

    await queryRunner.dropTable('statements');
  }
}
