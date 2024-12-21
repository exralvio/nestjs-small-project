import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateEmployessTable1734780207471 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'employees',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'firstName',
            type: 'varchar',
            length: '150',
          },
          {
            name: 'lastName',
            type: 'varchar',
            length: '150',
          },
          {
            name: 'departement_id',
            type: 'int',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'employees',
      new TableForeignKey({
        columnNames: ['departement_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'departements',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('employees');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('departement_id') !== -1,
    );
    await queryRunner.dropForeignKey('employees', foreignKey);

    await queryRunner.dropTable('employees');
  }
}