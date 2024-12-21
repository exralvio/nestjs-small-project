import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateCurrencyRatesTable1734780250042
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'currency_rates',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'currency_id',
            type: 'int',
          },
          {
            name: 'value',
            type: 'decimal',
            precision: 17,
            scale: 16,
          },
          {
            name: 'date',
            type: 'date',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'currency_rates',
      new TableForeignKey({
        columnNames: ['currency_id'],
        referencedTableName: 'currencies',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('currency_rates');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('currency_id') !== -1,
    );
    await queryRunner.dropForeignKey('currency_rates', foreignKey);

    await queryRunner.dropTable('currency_rates');
  }
}
