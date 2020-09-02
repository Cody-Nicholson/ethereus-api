import { RigModel, Rig } from "../models/rigs";

export class RigApi{

    get(ip: string): Promise<Rig>{
        return RigModel.findOne({ ip })
            .exec()
    }

    getAll(){
        return RigModel.find().exec()
    }

    put(rig: Rig){
        let model = new RigModel(rig);
        return model.save();
    }

    delete(ip: string){
        return RigModel.remove({ip})
    }

}