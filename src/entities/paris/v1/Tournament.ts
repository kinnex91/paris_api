// src/entities/Tournament.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ChampionshipDay } from './ChampionshipDay';
import { Configuration } from './Configuration';
import { Match } from './Match';

@Entity()
export class Tournament {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;

    @Column({ nullable: true, default:null  })
    tournamentCategory: string;

    @Column({ nullable: true, default:null  })
    sportCategory: string;

    @Column({ nullable: true , default:null })
    tournamentDescription: string;

    @Column({ nullable: true, default:null  })
    startDate: Date;

    @Column({ nullable: true, default:null  })
    endDate: Date;

    @OneToMany(() => ChampionshipDay, (day) => day.tournament)
    championshipDays: ChampionshipDay[];

    @OneToMany(() => Configuration, (config) => config.tournament)
    configurations: Configuration[];

    @OneToMany(() => Match, (matchs) => matchs.tournament)
    matchs: Match[];

}
