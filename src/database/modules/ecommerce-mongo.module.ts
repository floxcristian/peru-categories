// Nestjs
import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
// Modules
import { ConfigModule } from 'src/config/config.module';
// Services
import { ConfigService } from 'src/config/config.service';
/*import { traceMongoQueryPlugin } from './plugins/trace-query-plugin.mongo';*/

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const logger = new Logger(`Mongo:Ecommerce`);
        logger.log(
          `⌛ Conectando a MongoDB [${config.database.mongoUriEcommerce}]`,
        );
        return {
          uri: config.database.mongoUriEcommerce,
          connectionFactory: (connection: Connection) => {
            connection.on('connected', () => {
              logger.log('✅ Conexión a MongoDB establecida correctamente');
            });
            if (config.database.mongoDebug) {
              /*const logger = new Logger(`Mongo:default`);
              connection.plugin((schema) =>
                traceMongoQueryPlugin(logger, config.database, schema),
              );*/
            }
            return connection;
          },
        };
      },
    }),
  ],
})
export class EcommerceMongoModule {}
