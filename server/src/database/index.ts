import { appDataSource } from './dataSource';

export async function createDatabaseConnection() {
  try {
    await appDataSource.initialize();
  } catch (error) {
    console.log('Something went wrong on database connection', { error });
  }
} 
