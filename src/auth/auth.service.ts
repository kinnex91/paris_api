import {
    Injectable,
    ConflictException,
    UnauthorizedException,
    NotFoundException,
    BadRequestException,
    ServiceUnavailableException,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/paris/v1/User';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { isEmail } from 'class-validator';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import * as process from 'process';
import * as dotenv from 'dotenv';
import { LoggerUtils } from '../utils/LoggerUtils';
import * as jwt from 'jsonwebtoken';

dotenv.config();

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    private readonly jwtSecret = "" + process.env.SECRET
    async validateToken(token: string): Promise<User> {
        try {
          const decoded = jwt.verify(token, this.jwtSecret) as User; // Cast the token payload to User type
          return decoded;
        } catch (err) {
          try {
            // Attempt to retrieve the user from the token
            const user = await this.getUserFromToken(token); // Use await to resolve the Promise
            console.log(`#debug session expirée pour ${user.email}`);
            throw new UnauthorizedException('Session expired or invalid token');
          } catch (innerErr) {
            throw new UnauthorizedException('Session expired or invalid token');
          }
        }
      }

    async logout(authorizationHeader: string): Promise<{ message: String }> {
        try {
            const user = await this.getUserFromToken(authorizationHeader);

            //FEATURES-XXX - tracer heure de deconnexion. + sur session expirée server ou webclient
            // Récupère l'utilisateur à partir du token

            return { message: `${user.email}ask for logout` };
        } catch (error) {
            return { message: `eroor in logout` };
        }

    }




    async isLoggedIn(authorizationHeader: string): Promise<{ isLoggedIn: boolean }> {
        if (!authorizationHeader) {
            return { isLoggedIn: false };
        }

        const token = authorizationHeader.replace('Bearer ', '');

        try {
            await this.jwtService.verifyAsync(token, {
                secret: process.env.SECRET,
            });
            return { isLoggedIn: true };
        } catch (error) {
            return { isLoggedIn: false };
        }
    }


    async checkIfAdmin(authorizationHeader: string): Promise<{ isAdmin: boolean }> {
        const user = await this.getUserFromToken(authorizationHeader);
        return { isAdmin: user.isAdmin };
    }
   
    async login(email: string, password: string) {
        const methodName = LoggerUtils.getCurrentMethodName(this, this.login);
      
        try {
          console.log(`## Debug start ${methodName} for ${email}`);
      
          // Search for the user by email
          const user = await this.userRepository.findOneBy({ email });
          console.log('Utilisateur trouvé :', user);
      
          if (!user) {
            throw new NotFoundException('User not found');
          }
      
          console.log('#login services : User found in database ' + user.email);
      
          // Check if the email is verified
          if (!user.isEmailVerified) {
            throw new UnauthorizedException('Email not verified');
          }
      
          // Verify the password
          const isPasswordValid = await this.comparePasswords(password, user.password);
          if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
          }
      
          // Update the last login date
          user.lastLoginDate = new Date();
          await this.userRepository.save(user);
      
          // Remove the password from the response
          const { password: _, ...userWithoutPassword } = user;
      
          // Generate the JWT
          const jwt = this.generateToken(user);
      
          // Return the JWT and user information
          return { jwt, user: userWithoutPassword };
        } catch (error) {
          console.log(`### Fatal error in ${methodName}`);
          console.log(error);
          throw new HttpException('message', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }

    generateToken(user: User): string {
        const payload = {
          id: user.id,
          email: user.email,
          isAdmin: user.isAdmin,
        };
    
        const token = jwt.sign(payload, this.jwtSecret, {
          expiresIn: '60m', // Base token expiration time
        });
    
        return token;
      }

      refreshToken(oldToken: string): string {
        const decoded = jwt.verify(oldToken, this.jwtSecret) as any;
    
        const newToken = jwt.sign(
          {
            id: decoded.id,
            email: decoded.email,
            isAdmin: decoded.isAdmin,
          },
          this.jwtSecret,
          {
            expiresIn: '60m', // Extend the expiration time
          },
        );
    
        return newToken;
      }

    // Méthode d'enregistrement (register)
    async register(createUserDto: User): Promise<User> {

        const methodName = LoggerUtils.getCurrentMethodName(this, this.register);


        try {
            const { email, password } = createUserDto;
            console.log(`## Debug start ${methodName} for ${email}`);



            // Vérification de l'email
            if (!isEmail(email)) {
                console.log('Invalid email');
                throw new BadRequestException('Invalid email format -->' + email);
            }

            // Vérifier si l'utilisateur existe déjà
            const existingUser = await this.userRepository.findOne({ where: { email } });
            if (existingUser) {

                if (!existingUser.isEmailVerified) {
                    //FEATURES-001-IMPROVE_REGISTERED
                    //l'utilisateur n'a pas vérifié son mail, on regarde si le token date de plus d'une heure si oui on renvoie un nouveau token -->
                    existingUser.emailVerificationToken = uuidv4();
                    const savedUser = await this.userRepository.save(existingUser);
                    // Envoyer l'email de validation
                    await this.sendVerificationEmail(email, existingUser.emailVerificationToken);

                    savedUser.password='_';

                    return savedUser;


                }
                //On va renvoyer un token par mail du coup
                throw new ConflictException('Error-601');
            }

            // Vérifier les restrictions d'envoi d'email
            /*
            const canSendEmail = await this.checkEmailRateLimit();
            if (!canSendEmail) {
                throw new ServiceUnavailableException('Too many registrations. Please try again later.');
            }
            */
           
            // Hash du mot de passe
            const hashedPassword = await this.hashPassword(password);

            // Générer un token de validation par email
            const emailVerificationToken = uuidv4();

            // Création d'un nouvel utilisateur avec la date d'inscription en secondes
            const newUser = this.userRepository.create({
                email,
                password: hashedPassword,
                emailVerificationToken,
                isEmailVerified: false,
            });

            // Sauvegarde de l'utilisateur en base de données
            const savedUser = await this.userRepository.save(newUser);

            // Envoyer l'email de validation
            await this.sendVerificationEmail(email, emailVerificationToken);

            return savedUser;
        } catch (error) {
            console.log(`### Fatal error in ${methodName}`);
            console.log(error);
            throw new HttpException('message', HttpStatus.INTERNAL_SERVER_ERROR);
        }




    }

    // Vérifier les limites de temps d'inscription pour limiter l'envoi d'emails
    private async checkEmailRateLimit(): Promise<boolean> {

        const methodName = LoggerUtils.getCurrentMethodName(this, this.checkEmailRateLimit);

        try {

            console.log(`## Debug start ${methodName}`);


            const now = Math.floor(Date.now() / 1000);

            // Récupérer les 5 dernières inscriptions
            const recentUsers = await this.userRepository.find({
                order: { inscriptionDateTimeInLong: 'DESC' },
                take: 5,
            });

            if (recentUsers.length < 2) return true;

            // Vérifier si les deux dernières inscriptions se sont faites en moins de 5 secondes
            const [theUser, lastUser, secondLastUser] = recentUsers;
            if (now - lastUser.inscriptionDateTimeInLong < 31 && now - secondLastUser.inscriptionDateTimeInLong < 61) {
                console.log('#SecurityHackingTriggered# Bloqué: Les deux dernières inscriptions se sont faites en moins de 5 secondes');
                return false;
            } else {
                console.log('#SecurityHackingTriggered#debug#' + (now - lastUser.inscriptionDateTimeInLong));
                console.log('#SecurityHackingTriggered#debug#' + (now - secondLastUser.inscriptionDateTimeInLong));
            }

            // -de 10 seconde pour le dernier user ?
            if (recentUsers.length === 5) {
                const fifthLastUser = recentUsers[3];
                if (now - fifthLastUser.inscriptionDateTimeInLong < 10) {
                    console.log('#SecurityHackingTriggered# Bloqué: Les 5 dernières inscriptions se sont faites en moins d\'une minute');
                    return false;
                } else {
                    console.log('#SecurityHackingTriggered#debug#' + (now - fifthLastUser.inscriptionDateTimeInLong));
                }
            }

            return true;

        } catch (error) {
            console.log(`## Error in ${methodName}`);
            console.log(error);
            return true;

        }
    }

    // Méthode pour envoyer l'email de validation
    async sendVerificationEmail(email: string, token: string): Promise<void> {

        const methodName = LoggerUtils.getCurrentMethodName(this, this.sendVerificationEmail);

        try {

            console.log(`## Debug start ${methodName}`);



            const transporter = nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_IMAP_PORT,
                secure: true,
                auth: {
                    user: process.env.MAIL_NOREPLY,
                    pass: "j" + process.env.MAIL_PASSWORD,
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });

            const verificationUrl = process.env.FRONTEND_URL + `/verifyEmail?token=${token}`;

            const mailOptions = {
                from: process.env.MAIL_NOREPLY,
                to: email,
                subject: 'Vérification de l\'email / Email Verification',
                html: `
                    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                        
                        <!-- Bloc en français -->
                        <h3>Vérification de votre adresse email</h3>
                        <p>Bonjour,</p>
                        <p>Merci de vous être inscrit. Veuillez vérifier votre adresse email en cliquant sur le lien ci-dessous :</p>
                        <a href="${verificationUrl}" 
                           style="display: inline-block; background-color: #007bff; color: white; text-decoration: none; padding: 10px 15px; border-radius: 5px;">
                            Vérifier mon adresse email
                        </a>
                        <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller le lien suivant dans votre navigateur :</p>
                        <p><a href="${verificationUrl}" style="color: #007bff;">${verificationUrl}</a></p>
                        
                        <hr style="margin: 20px 0;">
                        
                        <!-- Bloc en anglais -->
                        <h3>Email Verification</h3>
                        <p>Hello,</p>
                        <p>Thank you for signing up. Please verify your email address by clicking on the link below:</p>
                        <a href="${verificationUrl}" 
                           style="display: inline-block; background-color: #007bff; color: white; text-decoration: none; padding: 10px 15px; border-radius: 5px;">
                            Verify my email address
                        </a>
                        <p>If the button does not work, you can copy and paste the following link into your browser:</p>
                        <p><a href="${verificationUrl}" style="color: #007bff;">${verificationUrl}</a></p>
                        
                        <hr style="margin: 20px 0;">
                        
                        <!-- Note d'information -->
                        <p style="font-size: 12px; color: #888;">
                            Si vous n'avez pas demandé cette inscription, ignorez cet email.<br>
                            If you did not request this registration, please ignore this email.
                        </p>
                    </div>
                `,
            };


            await transporter.sendMail(mailOptions);

        } catch (error) {
            console.log(`### Fatal error in ${methodName}`);
            console.log(error);
            const  user = await this.getUserFromToken(token);
            console.log(`# Debug error in ${methodName} when verify email for ${user.email}`);
            throw new HttpException('message', HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    // Méthode pour vérifier l'email
    async verifyEmail(token: string): Promise<void> {

        const methodName = LoggerUtils.getCurrentMethodName(this, this.verifyEmail);

        try {

            console.log(`## Debug start ${methodName}`);



            const user = await this.userRepository.findOne({ where: { emailVerificationToken: token } });

            if (!user) {
                throw new BadRequestException('Invalid or expired verification token');
            }

            user.isEmailVerified = true;
            user.emailVerificationToken = token; // Supprimer le token après la vérification

            await this.userRepository.save(user);
        } catch (error) {
            console.log(`### Fatal error in ${methodName}`);
            console.log(error);
            throw new HttpException('message', HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    // Méthodes utilitaires pour hasher et comparer les mots de passe
    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    private async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    // Méthode pour obtenir l'utilisateur à partir du token JWT
    async getUserFromToken(authorizationHeader: string): Promise<User> {
        if (!authorizationHeader) {
            throw new UnauthorizedException('Token JWT manquant');
        }

        const token = authorizationHeader.replace('Bearer ', ''); // Extraction du token sans le préfixe "Bearer"

        try {
            // Vérification du token JWT
            const decodedToken = await this.jwtService.verifyAsync(token, {
                secret: "" + process.env.SECRET, // Utiliser la clé secrète correcte
            });

            // Extraction de l'ID de l'utilisateur à partir du token
            const userId = decodedToken?.id;

            // Recherche de l'utilisateur dans la base de données
            const user = await this.userRepository.findOne({ where: { id: userId } });

            if (!user) {
                throw new NotFoundException('Utilisateur non trouvé');
            }

            return user;
        } catch (error) {
            console.log(error.message);
            throw new UnauthorizedException('Token JWT invalide ou expiré');
        }
    }

}
