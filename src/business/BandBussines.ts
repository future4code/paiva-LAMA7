import { IdGenerator } from './../services/IdGenerator';
import { Authenticator } from './../services/Authenticator';
import { BandInputDTO } from '../model/Band';
import { UserRole } from '../model/User';
import { UnauthorizedError } from '../error/UnauthorizedError';
import { InvalidInputError } from './../error/InvalidInputError';
import { BandDatabase } from '../data/BandDatabase';
import { Band } from './../model/Band';

export class BandBusiness{
  constructor(
    private bandDatabase:BandDatabase,
    private idGenerator:IdGenerator,
    private authentcator:Authenticator
  ){}
  async registerBand(input:BandInputDTO, token:string){
    const tokenData = this.authentcator.getData(token)
    if(tokenData.role!==UserRole.ADMIN){
      throw new UnauthorizedError("Only admin access")
    }
    if(!input.name||!input.mainGenre||!input.responsible){
      throw new InvalidInputError("Invalid input register band")
    }
    await this.bandDatabase.createBand(
      Band.toBand({
        ...input,
        id:this.idGenerator.generate()
      })!
    )
  }
  async getBandDetailByIdOrName (input:string):Promise<Band>{
    if(!input){
      throw new InvalidInputError("invalid input getBandDetails")
    }
    return this.bandDatabase.getBandByIdOrNameOrFail(input)
  }
}