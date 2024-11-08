@Module({
  imports: [TypeOrmModule.forFeature([Match])],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
