'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StoreReviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      storeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      image: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      rating: {
        type: Sequelize.INTEGER,  
        allowNull: false,
      },
      comment: {
        type: Sequelize.TEXT, 
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint('StoreReviews', {
      fields: ['storeId'],
      type: 'foreign key',
      name: 'fk_store_id_'+ Date.now(),
      references: {
        table: 'Stores',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    
    await queryInterface.addConstraint('StoreReviews', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_user_id_' + Date.now(),
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('StoreReviews');
  },
};
